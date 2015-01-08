(function () {
	// CoreChat(ref)
	var CoreChatBase = function (ref) {
		this._ref = ref;
		this._outboxRef = this._ref.child("outbox");
		this._events = this._events.concat(["login", "logout", "online", "offline"]);
		this._member;
		this.admin;
		
		// A helpful callback wrapper for integrating with Angular's digestion
		this._callbackWrap = function (func, args) {
			func.apply(func, args);
		};
		
		// CoreChat Methods
		
		this.login = function (token) {
			this._ref.authWithCustomToken(token, (function(error, member) {
				console.log(member)
				if (error) {
					this.trigger("login", error);
				} else {
					if (member.auth.roles && member.auth.roles.admin == true) {
						this.admin = new AdminInterface(this);
					}
					this._member = new SelfMember(this, member.uid, member);
					localStorage.setItem("corechat:firebaseToken", token);
					this.trigger("login", null, this._member);
				}
			}).bind(this));
		};
	
		this.logout = function () {
			this._ref.unauth();
			this._member = {};
			localStorage.setItem("corechat:firebaseToken", '');
			this.trigger("logout", null);
		};
		
		this.send = function (type, id, body) {
			if (!this._member) 
				throw "Must be logged in to send a message."
				
			type = type.slice(0, 1).toUpperCase() + type.slice(1, type.length);
			this._member['sendMessageTo' + type](id, body);
		};
		
		this.getMember = function (memberId) {
			return new Member(this, memberId);
		};
		
		this.getRoom = function (roomId) {
			return new Room(this, roomId);
		};
		
		this.getMembersByTag = function (tag) {
			var members = {},
				self = this;
			
			this._ref
				.child("members/byTag")
				.child(tag)
				.on("child_added", function (snapshot) {
					self._callbackWrap(function () {
						var memberId = snapshot.key();
						members[memberId] = new Member(self, memberId);	
					});
				});
				
			return members;
		}
		
		this._watchForTokenOnWindow = function () {
			// Hackssss
			var checkToken = (function () {
				var token = window.firebaseToken;
				if (token)
					this.login(token);
				else
					setTimeout(checkToken, 500);
			}).bind(this);
			
			checkToken();
		};
		
		this._attemptLoginFromLocalstorage = function () {
			var token = localStorage.getItem("corechat:firebaseToken");
			if (token)
				this.login(token);
		};
		
		// Firebase Connection Status
		
		this._ref.root().child("/.info/connected").on("value", (function (snapshot) {
			if (snapshot.val())
				this.trigger("online", null);
			else
				this.trigger("offline");
		}).bind(this));
		
		this._attemptLoginFromLocalstorage();
	};
	
	var CoreChat = function (ref, options) {
		var args = Array.prototype.slice.call(arguments);
		inherit(
			this, 
			[Eventable, [this]],
			[CoreChatBase, args]
		);
	}
	
	var AdminInterfaceBase = function (cc) {
		
		// This whole interface is messy
		this._events = this._events.concat(["members_updated", "rooms_updated"]);
		
		var membersByMidRef = cc._ref.child("members/byMID"),
			roomsByRidRef = cc._ref.child("rooms/byRID"),
			roomsByLastMessage = cc._ref.child("rooms/byLastMessage");
			
		this.rooms = {
			byId: {},
			byLastMessage: {}
		};
		
		this.members = {
			byId: {},
			byPage: {},
			byStatus: {}
		};
		
		this._lastMembers = {};
		this._lastRooms = {};
		
		this._updateRoom = (function (roomSnapshot) {
			var roomId = roomSnapshot.key(),
				lastRoom = this._lastRooms[roomId] || {},
				last_message = roomSnapshot.getPriority();
				
			if (lastRoom) {
				delete this.rooms.byLastMessage[lastRoom.last_message];
			}
			this.rooms.byLastMessage[last_message] = this.rooms.byId[roomId];
			lastRoom.last_message = last_message;
			this._lastRooms[roomId] = lastRoom;
			this.trigger("rooms_updated", null, this.rooms);
		}).bind(this);
		
		this._addRoom = (function (roomSnapshot) {
			var roomId = roomSnapshot.key();
				
			this.rooms.byId[roomId] = new Room(cc, roomId);
			this._lastRooms[roomId] = {};
			this.trigger("rooms_updated", null, this.rooms);
		}).bind(this);
		
		this._updateMember = (function (memberSnapshot) {
			var memberId = memberSnapshot.key(),
				memberRaw = memberSnapshot.val(),
				memberPage = memberRaw.page? 
					memberRaw.page.replace(/-/g, '/').replace(/\^/g, '#') : "Unknown",
				lastMemberRaw = this._lastMembers[memberId],
				lastMemberPage;
			
			this.members.byId[memberId] = new Member(cc, memberId); 
			
			if (lastMemberRaw) {
				lastMemberPage = lastMemberRaw.page? 
					lastMemberRaw.page.replace(/-/g, '/').replace(/\^/g, '#') : "Unknown";
					
				delete this.members.byPage[lastMemberPage][memberId];
				delete this.members.byStatus[lastMemberRaw.status][memberId];
			}
			
			if (!this.members.byPage[memberPage])
				this.members.byPage[memberPage] = {};
				
			this.members.byPage[memberPage][memberId] = true;
					
			if (!this.members.byStatus[memberRaw.status])
				this.members.byStatus[memberRaw.status] = {};
				
			this.members.byStatus[memberRaw.status][memberId] = true;
			
			this._lastMembers[memberId] = memberRaw;
			this.trigger("members_updated", null, this.members);
		}).bind(this);
		
		roomsByRidRef.on("child_added", this._addRoom);
	
		membersByMidRef.on("child_added", this._updateMember);
		membersByMidRef.on("child_changed", this._updateMember);
		
		roomsByLastMessage.on("child_added", this._updateRoom);
		roomsByLastMessage.on("child_moved", this._updateRoom);
	}
	
	var AdminInterface = function (cc) {
		var args = Array.prototype.slice.call(arguments);
		inherit(
			this, 
			[Eventable, [cc]],
			[AdminInterfaceBase, [cc]]
		);		
	}
	
	// SelfMember(uid, auth)
	
	var SelfMemberBase = function (cc, auth) {
		this._events = this._events.concat(["join_room", "recieved_notification", "removed_notification"])
		this.notifications = {}
		this.rooms = {};
		this.auth = auth;
		
		this._ref
			.child('notifications')
			.on("child_added", (function (notificationSnapshot) {
				// Notification types: message, mention
				var rawNotification = notificationSnapshot.val(),
					notification = new Notification(
						cc,
						notificationSnapshot.key(),
						rawNotification.type, 
						rawNotification.info);
						
				this.notifications[notification.id] = notification;
					
				this.trigger("recieved_notification", null, notification);
			}).bind(this));
			
		this._ref
			.child('notifications')
			.on("child_removed", (function (notificationSnapshot) {
				// Notification types: message, mention
				var rawNotification = notificationSnapshot.val(),
					notification = new Notification(
						cc,
						notificationSnapshot.key(),
						rawNotification.type, 
						rawNotification.info);
						
				delete this.notifications[notification.id];
					
				this.trigger("removed_notification", null, notification);
			}).bind(this));
			
		this._ref
			.child('rooms')
			.on("child_added", (function (roomSnapshot) {
				var roomId = roomSnapshot.key(),
					room = new Room(cc, roomId);
					
				this.rooms[roomId] = room;
					
				this.trigger("join_room", null, room);
			}).bind(this));
		
		this.sendMessageToRoom = function (roomId, body) {
			var room = new Room(cc, roomId);
			room.send(body);
		};
		
		this.sendMessageToMember = function (memberId, body) {
			var member = new Member(cc, memberId);
			member.send(body);
		}
	};
	
	var SelfMember = function (cc, uid, auth) {
		var args = Array.prototype.slice.call(arguments);
		inherit(
			this,
			[Eventable, [cc]],
			[MemberBase, args],
			[Statusable, [cc]],
			[SelfMemberBase, [cc, auth]]
		);
	}
	
	// Member(uid)

	var MemberBase = function (cc, uid) {
		this.id = uid;
		this.type = "member";
		this.exists = false;
		this._ref = cc._ref
			.child("members/byMID")
			.child(this.id);
		this.rooms = fdata(this, 'rooms');
			
		this._ref.on("value", (function (memberSnapshot) {
			var memberData = memberSnapshot.val();
			this.exists = !!memberData;
			
			this.email = memberData.email;
			this.name = memberData.name;
			this.avatar = memberData.avatar;
			this.tags = memberData.tags || {};
		}).bind(this));
		
		this.join = function (rid) {
			this._ref
				.child("rooms")
				.child(rid)
				.set(true);
				
			cc._ref
				.child("rooms/byRID")
				.child(rid)
				.child("members")
				.child(this.id)
				.set(true);
		};
		
		this.tags = {
			add: function (tag) {
				this._ref.child('tags').child(tag).set(true)
			},
			remove: function (tag) {
				this._ref.child('tags').child(tag).set(false);
			},
			has: function (tag) {
				return this.tags[tag] || false;
			}
		}
	};
	
	var Member = function (cc) {
		var args = Array.prototype.slice.call(arguments);
		inherit(
			this, 
			[Eventable, [cc]],
			[Chatable, [cc]],
			[MemberBase, args]
		);
	}
	
	// Room(rid)

	var RoomBase = function (cc, rid) {
		this._events = this._events.concat(["member_joined"]);
		this.id = rid;
		this.type = "room";
		this.members = {};
		this.history = [];
		this.openess = "closed"; // closed or private (maybe open someday)
		this._ref = cc._ref
			.child("rooms/byRID")
			.child(this.id);
			
		this._ref
			.child("history")
			.on("child_added", (function (messageSnapshot) {
				var rawMessage = messageSnapshot.val(),
					message = new Message(
						cc, 
						rawMessage.to, 
						rawMessage.from, 
						rawMessage.body,
						"room");
						
				this.history.push(message);
						
				this.trigger("message", null, message)
			}).bind(this));
			
		this._ref
			.child("members")
			.on("child_added", (function (memberSnapshot) {
				var memberId = memberSnapshot.key(),
					member = new Member(cc, memberId);
				
				this.members[memberId] = member;
				
				this.trigger("member_joined", null, member);
			}).bind(this));
	};
	
	var Room = function (cc) {
		var args = Array.prototype.slice.call(arguments);
		inherit(
			this, 
			[Eventable, [cc]],
			[Chatable, [cc]],
			[RoomBase, args]
		);
	};
	
	// Message(to, from, body)

	var MessageBase = function (cc, to, from, body, type) {
		this.to = to
		this.from = from;
		this.body = body;
		this.type = type;
		
		this._save = function () {
			cc._outboxRef
				.push({
					to: this.to, 
					from: this.from, 
					body: this.body, 
					type: this.type
				});
		}
	};
	
	var Message = function (cc) {
		var args = Array.prototype.slice.call(arguments);
		inherit(
			this, 
			[MessageBase, args]
		);
	};

	
	// Notification(id, type, info)
	
	var NotificationBase = function (cc, id, type, info) {
		this.id = id;
		this.type = type; // mention, message
		this.info = info;
		
		this.acknowledge = function () {
			cc._member._ref
				.child("notifications")
				.child(this.id)
				.remove();
		};
	};
	
	var Notification = function (cc) {
		var args = Array.prototype.slice.call(arguments);
		inherit(
			this,
			[NotificationBase, args]
		);
	};

	// ** Inheritables

	// Event System

	var Eventable = function (cc) {
		this._bindings = {};
		this._events = [];
		
		this.trigger = function (event) {
			var args = Array.prototype.slice.call(arguments, 1);
			
			for (var cbIndex in this._bindings[event]) {
				var cb = this._bindings[event][cbIndex];

				cc._callbackWrap(cb, args);
			}
			
			if (!this._bindings[event] || !this._bindings[event].length) {
				cc._callbackWrap(function () {}, []);
			};
		};
	
		this.on = function (event, callback) {
			if (this._events.indexOf(event) == -1) 
				throw "Unknown event type [%s]".replace('%s', event);
				
			(this._bindings[event] || (this._bindings[event] = []))
				.push(callback);
		};
	
		this.off = function (event) {
			this._bindings[event] = [];
		};
	};

	// Chat System

	var Chatable = function (cc) {
		this._events = this._events.concat(["message"]);
		
		this.send = function (body) {
			var message;
			message = new Message(cc, this.id, cc._member.id, body, this.type);
			message._save();
		};
	};
	
	// Status System
	
	var Statusable = function (cc) {
		this._events = this._events.concat(["status_change"]);
		this._timeout = 10e3;
		this._lastEvent = (new Date()).getTime();
		this._status = "offline"; // offline, online, away
		
		this._initializeStatusCheck = function () {
			this._changeStatus("online");
			
			cc._ref
				.child("members/byMID")
				.child(this.id)
				.child("status")
				.onDisconnect()
				.set("offline");
			
			var body = document.getElementsByTagName("body")[0];
			
			body.addEventListener("mousemove", this._registerEvent.bind(this));
			body.addEventListener("keydown", this._registerEvent.bind(this));
			
			setInterval(this._performStatusCheck.bind(this), this._timeout);
			setInterval(this._performHashCheck.bind(this), 1e3);
		};
		
		this._performStatusCheck = function () {
			var currentTime = (new Date()).getTime();
			if (currentTime > this._lastEvent+this._timeout) {
				this._changeStatus("away");
			}
		};
		
		this._performHashCheck = function () {
			var page = (document.location.pathname + document.location.hash)
				.replace(/\//g, '-')
				.replace(/#/g, '^');
			
			this._ref.child('page').set(page);
		};
		
		this._registerEvent = function () {
			var currentTime = (new Date()).getTime();
			this._lastEvent = currentTime;
			
			this._changeStatus("online");
		};
		
		this._changeStatus = function (newStatus) {
			if (this._status !== newStatus) {
				this.trigger("status_change", null, newStatus);
				this._status = newStatus;
				
				cc._ref
					.child("members/byMID")
					.child(this.id)
					.child("status")
					.set(this._status);
			}
		}
			
		this._initializeStatusCheck();
	};
	
	// ** Utilities

	// Firebase Helper

	var fdata = function (obj, field) {
		var d = {},
		    dref = obj._ref.child(field);

		dref.on("child_added", function (snapshot) {
			d[snapshot.key()] = snapshot.val();
		});

		dref.on("child_changed", function (snapshot) {
			d[snapshot.key()] = snapshot.val();
		});
		
		return d;
	};

	// Multiple Inheritance Helper

	var inherit = function(obj) {
		for (var i = 1, length = arguments.length; i < length; i++) {
			var source = arguments[i],
				args = [];

			if (source.length) {
				args = source[1];
				source = source[0];
			}
			
			source.apply(obj, args);
		}
		return obj;
	};

	// Expose CoreChat
	window.CoreChat = CoreChat;
}());