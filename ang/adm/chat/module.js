require('../../../public/lib/firebase/firebase.js');
require('../../chat/core.js');
require('../../chat/app.js');

angular.module("ADMChat", ["chat-widget"])

.config(function($locationProvider, $routeProvider) {

  $routeProvider.when('/adm/chat', {
    template: require('./list.html'),
    controller: 'ChatCtrl'
  });

})

.controller('ChatCtrl', function($scope, corechat) {
  // Magic
  $scope.$watch('session', function (session) {
    if (!session) return;
    
    var user = {
      email: session.email || "",
      name: session.name || "",
      avatar: session.avatar || ""
    };
    
    corechat.cc.on("login", function (err, member) {
      member._ref.update(user);
    });
    
    window.firebaseToken = session.firebaseToken;
  });
  
  $scope.setCurrentUser = function (memberId) {
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
})

function getMemberToMemberRID () {
  return Array.prototype.slice.call(arguments).sort().join('^^v^^')
}