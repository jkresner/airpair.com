;(function () {
    var cc, ref, app = angular.module("chat-widget", []);

    app.config(function($logProvider){
        $logProvider.debugEnabled(false);
    });
    
    app.directive('memberInfo', function () {
        return {
            link: function ($scope, elem, attrs) {
                $scope.member = cc.getMember(attrs.memberInfo);  
            }     
        };
    });
    
    app.directive('roomInfo', function () {
        return {
            link: function ($scope, elem, attrs) {
                $scope.room = cc.getRoom(attrs.roomInfo);  
            }     
        };
    });
    
    app.directive('chatWidget', function () {
        return {
            template: require('./nav.html'),
            controller: function ($scope, corechat) {
                $scope.corechat = corechat;
            }
        };
    });
    
    app.service("corechat", function ($rootScope, $log, $timeout) {
        var $scope = $rootScope.$new(true),
            initialized,
            cc, ref, transferFrom;
        
        $timeout(function () {
            $scope.initialize();
        }, 90e3);
        
        var unwatchSession = $rootScope.$watch('session', function (session) {
            if (!session) return;
            
            if (session.name || session.email) {
                $scope.initialize();
                unwatchSession();
            }
        });
        
            
        $rootScope.$watch('session', function (session) {
            if (!session) return;
            
            var lastUID = localStorage.getItem("corechat:lastUID"),
                lastMode = localStorage.getItem("corechat:mode");
                
            if (session.sessionID) localStorage.setItem("corechat:mode", "anonymous");
            else {
                localStorage.setItem("corechat:mode", "user");
                localStorage.setItem("corechat:lastMode", lastMode);
                localStorage.setItem("corechat:lastUID", "");
            }
                
            if (lastUID && lastMode == "anonymous") {
                transferFrom = lastUID;
                localStorage.setItem("corechat:lastUID", "");
            }
        });
        
        $scope.initialize = function () {
            if (initialized) return false;
            initialized = true
            
            ref = new Firebase("https://airpair-chat-dev.firebaseio.com/"),
            cc = new CoreChat(ref);
            window.cc = cc;
                
            $scope.cc = cc;
            $scope.ref = cc._ref;
            
            cc._watchForTokenOnWindow();    
            
            cc._callbackWrap = function (func, args) {
                $timeout(function () {
                    func.apply(func, args); 
                });
            };
            
            $scope.setActiveRoom = function (roomId) {
                $scope.activeRoom = roomId;  
                angular.forEach(cc._member.notificationsByRoom[roomId], function (notification) {
                   notification.acknowledge();
                });
            };
            
            $scope.setActiveRoomAsMember = function (member) {
                var RID = getMemberToMemberRID(member.id, cc._member.id);
                $scope.setActiveRoom(RID);
                cc._member.join(RID);
            };
            
            $scope.sendMessageToRoom = function (roomId, body) {
                cc.send("room", roomId, body);
            };
            
            $scope.sendMessageToMember = function (memberId, body) {
                cc.send("member", memberId, body);
            };
            
            $scope.getMember = function (memberId) {
                return cc.getMember(memberId);
            };
            
            $scope.getMembersByTag = function (tag) {
                return cc.getMembersByTag(tag);
            };
            
            $scope.getRoom = function (roomId) {
                return cc.getRoom(roomId);
            };
            
            $scope.login = function (token) {
                cc.login(token);
            };
            
            $scope.logout = function (token) {
                cc.logout();
            };
            
            $scope.join = function (RID) {
                cc._member.join(RID)
            };
        
            cc.on("online", function () {
                $log.log("connected to chat server!")
            });
            
            cc.on("offline", function () {
                $log.log("disconnected from chat server!")
            });
                
            cc.on("login", function (err, member) {
                if (err) {
                    $log.log(err);
                    return;
                }
                
                var id = member.id;
                
                if (transferFrom && transferFrom !== member.id) {
                    cc._ref.child("transfers").push({
                       from: transferFrom,
                       to: member.id
                    });
                }
                
                $scope.selfmember = {
                    status: "online",
                    notifications: {},
                    notificationsCount: 0,
                    loggedIn: false
                    
                };
                
                $scope.isAdmin = typeof cc.admin !== "undefined";
                
                if ($scope.isAdmin) {
                    $scope.admin = cc.admin;
                }
                
                $log.log("Logged in as", member);
                
                $scope.selfmember.loggedIn = true;
                $scope.selfmember.rooms = member.rooms;
                $scope.selfmember.notifications = member.notifications;
                $scope.selfmember.id = member.id;
                $scope.selfmember.notificationsByRoom = cc._member.notificationsByRoom;
                $scope.selfmember.notificationsCountByRoom = cc._member.notificationsCountByRoom;
    
                member.on("status_change", function (err, status) {
                    $log.log("You are flagged as", status);
                    $scope.selfmember.status = status;
                });
                
                member.on("join_room", function (err, room) {
                    $log.log("You joined room", room)
                    room.on("message", function (err, message) {
                        $log.log("Got a message", message, room.id); 
                    });
                });
                
                member.on("recieved_notification", function (err, notification) {
                   if (notification.info.to == $scope.activeRoom) notification.acknowledge();
                });
                
                $rootScope.$watch('session', function (session) {
                    if (!session || session.id !== id) return;
                    
                    var user = {
                      email: session.email || "",
                      name: session.name || "",
                      avatar: session.avatar || "",
                      transferFrom: transferFrom || ""
                    };
                    
                    cc._member._ref.update(user);
                });
            });
            
            cc.on("logout", function () {
                console.log("logout");
                $scope.selfmember = {}; 
            });
       
            function getMemberToMemberRID () {
        		return Array.prototype.slice.call(arguments).sort().join('^^v^^')
        	}
        };
        
        $scope.initialize()
        return $scope;
    });
    
    app.controller('Admin', function ($scope, $routeParams) {
        $scope.memberId = $routeParams.memberId; 
    });
    
    //angular.bootstrap(document.getElementById("chat-widget"), ['chat-widget']);
}());