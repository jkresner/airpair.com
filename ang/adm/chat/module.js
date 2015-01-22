require('../../../public/lib/firebase/firebase.js');
require('../../../public/lib/moment/moment.js');
require('../../../public/lib/angular-moment/angular-moment.js');
require('../../chat/core.js');
require('../../chat/app.js');

angular.module("ADMChat", ["chat-widget", "angularMoment"])

.config(function($locationProvider, $routeProvider) {
  $routeProvider.when('/adm/chat', {
    template: require('./list.html'),
    controller: 'ChatCtrl'
  });
})

.controller('ChatCtrl', function($scope, $timeout, corechat, $log) {
  $log.info('ChatCtrl');
  $scope.setCurrentUser = function (memberId) {
    $log.info('setCurrentUser()', memberId);
    var RID = getMemberToMemberRID(memberId, corechat.selfmember.id);
    $scope.currentUser = corechat.getMember(memberId);
    $scope.currentUser.join(RID);
    corechat.join(RID);
    corechat.setActiveRoom(RID);
  };

  $scope.getRoomType = function (room) {
    if (!room || !room.id) return;
    return room.id.split("^^v^^").length > 1? "pair":"group";
  };

  $scope.allRooms = {};

  corechat.ref.child("rooms/byRID").on("child_added", function (snapshot) {
    $timeout(function () {
      var RID = snapshot.name();
      $scope.allRooms[RID] = corechat.getRoom(RID);
    });
  });

  corechat.ref.child("rooms/byRID").on("child_removed", function (snapshot) {
    $timeout(function () {
      var RID = snapshot.name();
      delete $scope.allRooms[RID];
    });
  });
})

function getMemberToMemberRID () {
  return Array.prototype.slice.call(arguments).sort().join('^^v^^')
}
