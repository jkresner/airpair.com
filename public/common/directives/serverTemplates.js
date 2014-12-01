
angular.module("APServerTemplates", [])

  .directive('noCompile', function() {

    return {

      terminal: true,

      controller : function() {

      }
    };

  })

  .directive('serverTemplate', function() {

    return {

      controller : function() {

      }
    };

  })
