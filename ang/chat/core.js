(function () {
	// CoreChat(ref)
	var CoreChatBase = function (ref) {
		this._ref = ref;
		this._outboxRef = this._ref.child("outbox");
		this._events = this._events.concat(["login", "logout", "online", "offline"]);
		this._member;
		this._rooms = {};
		this._members = {};
		this._membersByRole = {};
		this._membersByRoleFlag = {};
		this.admin;

		// A helpful callback wrapper for integrating with Angular's digestion
		this._callbackWrap = function (func, args) {
			func.apply(func, args);
		};
		
		this.setWrapper = function (wrapper) {
			var render = throttle(wrapper, this, 50);
			this._callbackWrap = function (func, args) {
				if (func)
					setTimeout(function () {
						func.apply(func, args);	
					})
				render();
			}
		};

		// CoreChat Methods

		this.login = function (token) {
			//console.log("logging in")
			if (this._member) {
				this.logout();
			}
			this._ref.authWithCustomToken(token, (function(error, member) {
				if (error) {
					this.trigger("login", error);
				} else {
					//console.log("Logged in as", member.uid)
					this._member = new SelfMember(this, member.uid, member);
					localStorage.setItem("corechat:firebaseToken", token);
					this.trigger("login", null, this._member);
				}
			}).bind(this));
		};

		this.logout = function () {
			this._ref.unauth();
			this._member.detach();
			this._member = {};
			localStorage.setItem("corechat:firebaseToken", "");
			this.trigger("logout", null);
		};

		this.send = function (type, id, body) {
			if (!this._member)
				throw "Must be logged in to send a message."

			type = type.slice(0, 1).toUpperCase() + type.slice(1, type.length);
			this._member['sendMessageTo' + type](id, body);
		};

		this.getMember = function (memberId) {
			if (!memberId)
				return {};

			if (!this._members[memberId])
				this._members[memberId] = new Member(this, memberId);

			return this._members[memberId];
		};

		this.getRoom = function (roomId) {
			if (!roomId)
				return {};

			if (!this._rooms[roomId])
				this._rooms[roomId] = new Room(this, roomId);

			return this._rooms[roomId];
		};

		this.getMembersByRole = function (role) {
			if (!this._membersByRole[role]) {
	 			var members = {},
					roleRef = this._ref
						.child("members/byRole")
						.child(role);
						
				roleRef
					.on("value", (function (membersSnapshot) {
						var hasMembers = false;
						for (var memberId in members) {
							delete members[memberId];
							this._membersByRoleFlag[role] = false;
						}
						membersSnapshot.forEach((function (memberSnapshot) {
							var memberId = memberSnapshot.key();
							if (memberSnapshot.val())
								members[memberId] = this.getMember(memberId);
							else
								memberSnapshot.ref().remove();
							hasMembers = true;
						}).bind(this))	
						
						this._callbackWrap((function () {
							this._membersByRoleFlag[role] = hasMembers;
						}).bind(this));
					}).bind(this))

				this._membersByRole[role] = members;
			}
			return this._membersByRole[role];
		}
		
		this.getAdminInterface = function () {
			return new AdminInterface(this);
		}

		this._watchForTokenOnWindow = function () {
			var checkLogin;

			checkLogin = (function () {
				var token = window.firebaseToken;
				if (token)
					this.login(token);
				else
					setTimeout(checkLogin, 500);
			}).bind(this);

			checkLogin();
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
			membersByPage = cc._ref.child("members/byPage"),
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

			this.rooms.byId[roomId] = cc.getRoom(roomId);
			this._lastRooms[roomId] = {};
			this.trigger("rooms_updated", null, this.rooms);
		}).bind(this);

		this._updateByPage = (function (action, pageSnapshot) {
			pageSnapshot.ref().on("child_added", this._updateMemberByPage.bind(this, action, pageSnapshot))
			pageSnapshot.ref().on("child_changed", this._updateMemberByPage.bind(this, action, pageSnapshot))
			pageSnapshot.ref().on("child_removed", this._updateMemberByPage.bind(this, "delete", pageSnapshot))
		}).bind(this);

		this._updateMemberByPage = (function (action, pageSnapshot, memberSnapshot) {
			var page = decodeURIComponent(pageSnapshot.key()),
				memberId = memberSnapshot.key();
				
			//console.log(memberId)
				
			if (memberId == cc._member.id) return;

			cc._callbackWrap((function () {
				if (action == "set") {
					if (!this.members.byPage[page])
						this.members.byPage[page] = {};

					this.members.byPage[page][memberId] = cc.getMember(memberId);
				} else {
					if (this.members.byPage[page]) {
						delete this.members.byPage[page][memberId];

						if (!Object.keys(this.members.byPage[page]).length)
							delete this.members.byPage[page];
					}
				}
				//console.log(this.members.byPage[page])
			}).bind(this));
		}).bind(this);

		roomsByRidRef.on("child_added", this._addRoom);

		//membersByMidRef.on("child_added", this._updateMember);
		//membersByMidRef.on("child_changed", this._updateMember);

		roomsByLastMessage.on("child_added", this._updateRoom);
		roomsByLastMessage.on("child_moved", this._updateRoom);

		membersByPage.on("child_added", this._updateByPage.bind(this, "set"));
		membersByPage.on("child_removed", this._updateByPage.bind(this, "remove"));
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
		this._events = this._events.concat(["join_room", "recieved_notification", "removed_notification"]);
		this.notifications = {};
		this.notificationsByRoom = {};
		this.notificationsCountByRoom = {};
		this.rooms = {};
		this.auth = auth;
		this.roles = auth.auth.roles || {};
		this._ref.child('roles').set(this.roles);

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

				(this.notificationsByRoom[rawNotification.info.to] || (this.notificationsByRoom[rawNotification.info.to] = {})
				)[notification.id] = notification;

				if (!this.notificationsCountByRoom[notification.info.to])
					this.notificationsCountByRoom[notification.info.to] = 1;
				else
					this.notificationsCountByRoom[notification.info.to] += 1;

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

				this.notificationsCountByRoom[notification.info.to] -= 1;

				delete this.notificationsByRoom[notification.info.to][notification.id];
				delete this.notifications[notification.id];

				this.trigger("removed_notification", null, notification);
			}).bind(this));

		this._ref
			.child('rooms')
			.on("child_added", (function (roomSnapshot) {
				var roomId = roomSnapshot.key(),
					roomIsActive = roomSnapshot.val(),
					room;
					
				if (roomIsActive) {
					room = cc.getRoom(roomId);
					this.rooms[roomId] = room;
				}

				this.trigger("join_room", null, room);
			}).bind(this));

		this._ref
			.child('rooms')
			.on("child_changed", (function (roomSnapshot) {
				var roomId = roomSnapshot.key(),
					roomIsActive = roomSnapshot.val(),
					room;
					
				if (roomIsActive) {
					room = cc.getRoom(roomId);
					this.rooms[roomId] = room;
				} else {
					delete this.rooms[roomId];
				}
			}).bind(this));

		this.sendMessageToRoom = function (roomId, body) {
			var room = cc.getRoom(roomId);
			room.send(body);
		};

		this.sendMessageToMember = function (memberId, body) {
			var member = cc.getMember(memberId);
			member.send(body);
		}
		
		this.leave = function (roomId) {
			this._ref
				.child("rooms")
				.child(roomId)
				.set(false);
		}

		this.detach = function () {
			this._ref.child("notifications").off();
			this.off();
			for (var intervalIndex in this._intervals) {
				var interval = this._intervals[intervalIndex];
				clearInterval(interval);
			}
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
		this._events = this._events.concat(["ready"])
		this.exists = false;
		this._ref = cc._ref
			.child("members/byMID")
			.child(this.id);
		this.rooms = fdata(this, 'rooms');
		this.page = fdata(this, 'page');

		this._setField = (function (snapshot) {
			cc._callbackWrap((function () {
				this[snapshot.key()] = snapshot.val();
			}).bind(this));
		}).bind(this);

		this.join = function (rid) {
			this._ref
				.child("rooms")
				.child(rid)
				.set(true);
		};

		this.roles = {
			add: function (role) {
				this._ref.child('roles').child(role).set(true)
			},
			remove: function (role) {
				this._ref.child('roles').child(role).set(false)
			},
			has: function (role) {
				return this.roles[role] || false
			}
		};
		
		// Cherry pick fields we need to avoid wasted bandwidth on pings and such
		["name", "email", "avatar", "roles", "status", "type"]
			.forEach((function (field) {
				this._ref.child(field).on("value", this._setField);
			}).bind(this));
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

		this.getMetadata = (function () {
			var members = this.members,
				implicitMembers = {},
				name = this.info? this.info.name : "",
				nonSelfMembers = {},
				nonSelfMembersCount = 0,
				memberId;

			for (memberId in members) {
				if (memberId !== cc._member.id) {
					nonSelfMembers[memberId] = members[memberId];
					nonSelfMembersCount += 1;
				}
			}
			
			//console.log(this.id, this.members, nonSelfMembers)

			if (nonSelfMembersCount == 1) {
				for (memberId in nonSelfMembers) {
					var member = members[memberId];
					if (member.id !== cc._member.id) member.hasChat = true;
					break;
				}
				this.info = member;
			} else if (nonSelfMembersCount > 1) {
				var memberNames = [];
				Object.keys(nonSelfMembers).forEach(function (memberIndex) {
					var member = nonSelfMembers[memberIndex];
					if (member.id !== cc._member.id) member.hasChat = true;
					var waitingOnName = setInterval(function () {
						if (!member.name) return;
						memberNames.push(member.name);
						clearInterval(waitingOnName);
						finish();
					});
				});
				
				var finish = (function () {
					if (memberNames.length == nonSelfMembersCount) {
						this.info = {name: memberNames.join(', '), avatar: ""};
					}	
				}).bind(this);	
			} else {
				if (this.id.split("^^v^^").length > 1) {
					var implicitMemberIds = this.id.split("^^v^^");
					for (var index in implicitMemberIds) {
						memberId = implicitMemberIds[index];
						if (memberId !== cc._member.id) {
							member = cc.getMember(memberId);
							member.hasChat = true;
							this.info = member;
							return;
						}
					}
				}
				this.info = {name: name, avatar: ""};
			}
		}).bind(this);

		this._ref
			.child("name")
			.on("value", (function (nameSnapshot) {
				var name = nameSnapshot.val();

				cc._callbackWrap((function () {
					this.getMetadata();
				}).bind(this));
			}).bind(this));

		this._ref
			.child("history")
			.on("value", (function (historySnapshot) {
				this.history = [];
				historySnapshot.forEach((function (messageSnapshot) {
					var rawMessage = messageSnapshot.val(),
						message = new Message(
							cc,
							rawMessage.to,
							rawMessage.from,
							rawMessage.body,
							rawMessage.timestamp,
							"room");
	
					this.history.push(message);
	
					this.trigger("message", null, message)	
				}).bind(this));
				
				cc._callbackWrap((function () {
					this.getMetadata();
				}).bind(this));
			}).bind(this));

		this._ref
			.child("members")
			.on("value", (function (membersSnapshot) {
				this.members = {};
				membersSnapshot.forEach((function (memberSnapshot) {
					var memberId = memberSnapshot.key(),
						member = cc.getMember(memberId),
						metadata;
	
					this.members[memberId] = member;
	
					this.trigger("member_joined", null, member);
	
					cc._callbackWrap((function () {
						this.getMetadata();
					}).bind(this));
				}).bind(this));
			}).bind(this));


		cc._callbackWrap((function () {
			this.getMetadata();
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

	var MessageBase = function (cc, to, from, body, timestamp, type) {
		this.to = to
		this.from = from;
		this.body = body;
		this.type = type;
		this.timestamp = timestamp || "";

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
			if (event)
				this._bindings[event] = [];
			else
				this._bindings = {};
		};
	};

	// Chat System

	var Chatable = function (cc) {
		this._events = this._events.concat(["message"]);

		this.send = function (body) {
			var message;
			message = new Message(cc, this.id, cc._member.id, body, "", this.type);
			message._save();
		};
	};

	// Status System

	var Statusable = function (cc) {
		this._events = this._events.concat(["status_change"]);
		this._timeout = 60e3; // 1 min
		this._offlineTimeout = 60*60e3; // 15 min
		this._lastEvent = (new Date()).getTime();
		this._status = "offline"; // offline, online, away
		this._intervals = [];

		var lastPage;

		this._initializeStatusCheck = function () {
			cc._ref
				.child("members/byMID")
				.child(this.id)
				.child("status")
				.onDisconnect()
				.set("offline");

			this._changeStatus("online");

			var body = document.getElementsByTagName("body")[0];

			body.addEventListener("mousemove", this._registerEvent.bind(this));
			body.addEventListener("keydown", this._registerEvent.bind(this));

			this._intervals.push(
				setInterval(this._performStatusCheck.bind(this), this._timeout)
			);
			this._intervals.push(
				setInterval(this._performHashCheck.bind(this), 1e3)
			);
			this._intervals.push(
				setInterval(this._performPing.bind(this), 59e3)
			);
			
			this._performPing()
		};
		
		this._performPing = function () {
			this._ref.child("ping/seen").set(Firebase.ServerValue.TIMESTAMP);
		};

		this._performStatusCheck = function () {
			var currentTime = (new Date()).getTime();
			if (currentTime > this._lastEvent+this._timeout) {
				this._changeStatus("away");
			}
			
			if (currentTime > this._lastEvent+this._offlineTimeout) {
				Firebase.goOffline();
			}
		};

		this._performHashCheck = function () {
			var page = encodeURIComponent(document.location.pathname + document.location.hash)

			if (page !== lastPage) {
				lastPage = page;
				this._ref.child('page').set({
					url: page,
					timestamp: Firebase.ServerValue.TIMESTAMP
				});
			}
		};

		this._registerEvent = function () {
			var currentTime = (new Date()).getTime();
			this._lastEvent = currentTime;

			this._changeStatus("online");
			Firebase.goOnline();
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

	// Generate 1:1 Room Name
	function getMemberToMemberRID () {
		return Array.prototype.slice.call(arguments).sort().join('^^v^^')
	}

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
	
	function throttle(func, wait, options) {
		/*.
		_.throttle from Underscore.js 1.7.0
		http://underscorejs.org
		(c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
		Underscore may be freely distributed under the MIT license.
		*/
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : (new Date().getTime());
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = (new Date().getTime());
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        clearTimeout(timeout);
	        timeout = null;
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };

	// Expose CoreChat
	window.CoreChat = CoreChat;
}());
