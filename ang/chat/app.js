;(function () {
    require('../../public/lib/angular-moment/angular-moment.min.js');
    require('../../public/lib/angular-scroll-glue/src/scrollglue.js');
    var cc, ref, app = angular.module("chat-widget", ['luegg.directives', 'angularMoment']);


    app.directive('memberInfo', function (corechat) {
        return {
            link: function ($scope, elem, attrs) {
                $scope.member = corechat.getMember(attrs.memberInfo);
            }
        };
    });

    app.directive('roomInfo', function (corechat) {
        return {
            link: function ($scope, elem, attrs) {
                $scope.room = corechat.getRoom(attrs.roomInfo);
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
    
    app.directive('timestamp', function () {
       return {
           scope: {
               "timestamp": "=timestamp"
           },
           template: '<span am-time-ago="timestamp_valid"></span><span ng-show="timestamp_invalid">a few seconds ago...</span>',
           controller: function ($scope, $interval) {
                var stop = $interval(function () {
                    if ($scope.timestamp < new Date().getTime()) {
                        $scope.timestamp_valid = $scope.timestamp;
                        $scope.timestamp_invalid = false;
                        $interval.cancel(stop);
                    } else {
                        $scope.timestamp_invalid = true;
                    }
                }, 100);
                
           }
       } 
    });

    app.service('corechat', function ($rootScope, $log, $timeout, $interval) {
        var $scope = $rootScope.$new(true), sessionID,
            cc, ref, transferFrom, lastSession;

        $scope.initialize = function () {
            if ($scope.initialized) return false;
            $scope.initialized = true

            ref = new Firebase($rootScope.chatSettings.firebaseUrl),
            cc = new CoreChat(ref);

            $rootScope.cc = cc;
            $scope.ref = cc._ref;
            
            if ($rootScope.session && $rootScope.session.firebaseToken) {
                cc.login($rootScope.session.firebaseToken);
            }

            cc._callbackWrap = function (func, args) {
                $timeout(function () {
                    func.apply(func, args);
                });
            };

            $scope.setActiveRoom = function (roomId) {
                $scope.activeRoomId = roomId;
                $scope.activeRoom = $scope.selfmember.rooms[$scope.activeRoomId];
                angular.forEach(cc._member.notificationsByRoom[roomId], function (notification) {
                   notification.acknowledge();
                   --$scope.selfmember.notificationsCount;
                });
            };

            $scope.setActiveRoomAsMember = function (member) {
                var RID = getMemberToMemberRID(member.id, cc._member.id);
 
                $scope.join(RID);
                $scope.setActiveRoom(RID);
            };

            $scope.sendMessageToRoom = function (roomId, body) {
                if( !body ) return false;
                cc.send("room", roomId, body);
            };

            $scope.sendMessageToMember = function (memberId, body) {
                cc.send("member", memberId, body);
            };

            $scope.getMember = function (memberId) {
                return cc.getMember(memberId);
            };

            $scope.getMembersByRole = function (role) {
                return cc.getMembersByRole(role);
            };

            $scope.getRoom = function (roomId) {
                return cc.getRoom(roomId);
            };
            
            $scope.getActiveRoom = function () {
                return $scope.selfmember.rooms[$scope.activeRoomId]  
            };
            
            $scope.getMembersByRoleFlag = function () {
                return cc._membersByRoleFlag || {};
            }

            $scope.login = function (token) {
                cc.login(token);
            };

            $scope.logout = function (token) {
                cc.logout();
            };

            $scope.join = function (RID) {
                cc._member.join(RID)
            };
            
            $scope.findOrCallback = function (memberId, callback) {
                for (var RID in $scope.selfmember.rooms) {
                    var room = $scope.getRoom(RID);
                    if (room.info.id == memberId) {
                        console.log('setitng active room')
                        $scope.setActiveRoom(RID);
                        return;
                    }
                }
                callback(memberId);
            };
            
            $scope.leaveActiveRoom = function () {
                delete $scope.activeRoomId;
                delete $scope.activeRoom;
            };

            cc.on("online", function () {
                //$log.log("connected to chat server!")
            });

            cc.on("offline", function () {
                //$log.log("disconnected from chat server!")
            });

            cc.on("login", function (err, member) {
                if (err) {
                    //$log.log(err);
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
                
                if (cc._member && cc._member.roles && cc._member.roles.admin) {
                    $scope.isAdmin = true;
                    $scope.admin = cc.getAdminInterface();
                }

                $scope.selfmember.loggedIn = true;
                $scope.selfmember.name = cc._member.name;
                $scope.selfmember.avatar = cc._member.avatar;
                $scope.selfmember.rooms = member.rooms;
                $scope.selfmember.notifications = member.notifications;
                $scope.selfmember.id = member.id;
                $scope.selfmember.notificationsByRoom = cc._member.notificationsByRoom;
                $scope.selfmember.notificationsCountByRoom = cc._member.notificationsCountByRoom;

                member.on("status_change", function (err, status) {
                    //$log.log("You are flagged as", status);
                    $scope.selfmember.status = status;
                });

                member.on("recieved_notification", function (err, notification) {
                    // don't increment notificationsCount if the notification is in this room
                    if (notification.info.to == $scope.activeRoomId) {
                      notification.acknowledge();
                    } else {
                      $scope.selfmember.notificationsCount++;
                    }
                });

                var unwatch = $rootScope.$watch('session', function (session) {
                    if (!session || (session._id !== id && session.sessionID !== id)) {
                        unwatch();
                        return;
                    }
                    
                    var user = {};
                    if (session.email) user.email = session.email
                    if (session.name) user.name = session.name
                    if (session.avatar) user.avatar = session.avatar
                    if (session.transferFrom) user.avatar = session.transferFrom


                    cc._member._ref.update(user, function () {
                        $timeout(function () {
                            $scope.selfmember.name = cc._member.name;
                            $scope.selfmember.avatar = cc._member.avatar;
                        });
                    });
                });
            });

            cc.on("logout", function () {
                //$log.log("logout");
                $scope.selfmember = {}; 
            });

            function getMemberToMemberRID () {
        		return Array.prototype.slice.call(arguments).sort().join('^^v^^')
        	}
        };
        
        if (localStorage.getItem("timeoutInitialize"))
            $scope.initialize();

        $timeout(function () {
            $scope.initialize();
            localStorage.setItem("timeoutInitialize", true);
        }, 10e3);

        var unwatchSession = $rootScope.$watch('session', function (session) {
            if (!session) return;

            if (session.name || session.email) {
                $scope.initialize();
                unwatchSession();
            }
        });


        $rootScope.$watch('session', function (session) {
            $log.log(session)
            if (!session) return;
            
            if (!session.sessionID) localStorage.setItem("timeoutInitialize", "");

            /*if (sessionID && (session._id !== sessionID && session.sessionID !== sessionID)) {
                //$log.log("SessionID", sessionID, "doesn't match", session._id || session.sessionID)
                sessionID = session._id || session.sessionID;
            }*/
            
            console.log(session)
            cc && session.firebaseToken? cc.login(session.firebaseToken) : null;
            
            //sessionID = session._id || session.sessionID;

            if (lastSession && lastSession.unauthenticated && session._id)
                cc._ref.child("transfers").push({
                   to: session._id,
                   from: lastSession.sessionID
                });
            lastSession = session;
        });

        // $scope.initialize();
        return $scope;
    });

    app.controller('Admin', function ($scope, $routeParams) {
        $scope.memberId = $routeParams.memberId;
    });

    //angular.bootstrap(document.getElementById("chat-widget"), ['chat-widget']);
}());
