
angular.module("APFormsDirectives", [])

  .directive('formGroup', function() {

    return {

      scope: true,

      //-- Sometimes controller may run before link
      controllerAs: 'formGroup',
      controller : function() {
        //-- Setting a placeholder
        // this.update = angular.noop;
      },

      // -- tells directive we want to have ctrl param (as 4th param)
      require: ['^form','formGroup'],

      link : function(scope, element, attrs, ctrls) {
        var formCtrl = ctrls[0];
        var ctrl = ctrls[1];
        ctrl.$fieldSubmitted = false

        element.addClass('form-group');

        var form = element.closest('form').on('submit', function() {
          // console.log('submit', ctrl.$fieldSubmitted)
          if (!ctrl.$fieldSubmitted)
          {
            ctrl.$fieldSubmitted = true
            ctrl.showError(ctrl.model)
          }
        })

        ctrl.showError = function(model) {
          ctrl.model = model;
          var show = model.$invalid && (model.$touched || ctrl.$fieldSubmitted)
          // console.log('show', element, model.$invalid, 'touched', model.$touched, ctrl.$fieldSubmitted)
          element.toggleClass('has-error', show).toggleClass('has-feedback', show);
          return show
        }

        // ctrl.update = function(valid) {
        // 	var showError = !valid && ctrl.showError()
        // 	// var showError = ctrl.showError(model);
        // 	console.log('update.valid', showError);

        // 	element.toggleClass('has-error', showError).toggleClass('has-feedback', showError);
        // }

      }
    };

  })

  .directive('formControl', function() {

    return {

      // ^ get the parent's controller
      // ngModel has it's own controller which can get access too
      // <input type="text" ng-model="login.email" form-control />
      // <input type="text" ng-model="login.password" form-control />
      require: ['^formGroup', 'ngModel'],

      link: function(scope, element, attrs, ctrls) {
        element.addClass('form-control')
        // Add back in when we figure out css
        // element.after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>')

        // var formGroupCtrl = ctrls[0];
        // var ngModelCtrl = ctrls[1];

        //-- $valid is a property on all controllers by default (and forms)
        // scope.$watch( (() => ngModelCtrl.$valid || !ngModelCtrl.$viewValue),

        // 	// this param is not ngModelCtrl.$valid, but the return of the first function
        // 	(valid) => {

        // 		console.log('ngModelCtrl.$valid', ngModelCtrl.$valid, '$viewValue', ngModelCtrl.$viewValue)

        // 		//-- if empty string
        // 		// var isempty = !ngModelCtrl.$modelValue;
        // 		// console.log('isempty', isempty, ngModelCtrl.$modelValue)
        // 		// formGroupCtrl.update(valid)

        // 		formGroupCtrl.update(valid)
        // });
      }
    };

    //-- $viewValue vs $modelValue
    // -- $viewValue updates when you type,
    //-- $modelValue only update when all validations pass
  })


  .directive('formErrors', function() {

    return {
      template: require('./formErrors.html')
    }
  })

;
