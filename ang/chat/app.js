;(function () {
    var app = angular.module("chat-widget", []),
        ref = new Firebase("https://airpair-chat-dev.firebaseio.com/"),
        cc = new CoreChat(ref);
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
        var $scope = $rootScope.$new(true);
            
        $scope.cc = cc;
        
        cc._watchForTokenOnWindow();    
        
        cc._callbackWrap = function (func, args) {
            $timeout(function () {
                func.apply(func, args); 
            });
        };
        
        $scope.selfmember = {
            status: "online",
            notifications: {},
            notificationsCount: 0,
            loggedIn: false
            
        };
        
        $scope.setActiveRoom = function (roomId) {
            $scope.activeRoom = roomId;  
        };
        
        $scope.sendMessageToRoom = function (roomId, body) {
            cc.send("room", roomId, body);
        };
        
        $scope.sendMessageToMember = function (memberId, body) {
            cc.send("member", memberId, body);
        };
        
        $scope.getMember = function (memberId) {
            return cc.getMember(memberId);
        }
        
        $scope.login = function (token) {
            cc.login(token);
        };
        
        $scope.logout = function (token) {
            cc.logout();
        };
        
        $scope.join = function (RID) {
            cc._member.join(RID)
        }
    
        cc.on("online", function () {
            $log.log("connected to chat server!")
        });
        
        cc.on("offline", function () {
            $log.log("disconnected from chat server!")
        })
            
        cc.on("login", function (err, member) {
            if (err) {
                $log.log(err);
                return;
            }
            
            $scope.isAdmin = typeof cc.admin !== "undefined";
            $scope.selfmember.loggedIn = true;
            $scope.selfmember.id = member.id;
            
            if ($scope.isAdmin) {
                $scope.admin = cc.admin;
            }
            
            $log.log("Logged in as", member);
            
            $scope.selfmember.loggedIn = true;
            $scope.selfmember.rooms = member.rooms;
            $scope.selfmember.notifications = member.notifications;
            
            member.on("status_change", function (err, status) {
                $log.log("You are flagged as", status);
                $scope.selfmember.status = status;
            });
            
            member.on("recieved_notification", function (err, notification) {
                $scope.selfmember.notificationsCount += 1;
            });
            
            member.on("removed_notification", function (err, notification) {
                $scope.selfmember.notificationsCount -= 1;             
            });
            
            member.on("join_room", function (err, room) {
                $log.log("You joined room", room)
                room.on("message", function (err, message) {
                    $log.log("Got a message", message, room.id); 
                });
            })
            
            //member.join("amazing-chat");
        });
        
        cc.on("logout", function () {
            $scope.selfmember = {}; 
        });
        
        return $scope;
    });
    
    app.controller('Admin', function ($scope, $routeParams) {
        $scope.memberId = $routeParams.memberId; 
    });
    
    //angular.bootstrap(document.getElementById("chat-widget"), ['chat-widget']);
}());