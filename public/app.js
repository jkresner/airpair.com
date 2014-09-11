/*
  Your main application module should be in your root client directory. A module should never be altered other than the one where it is defined.
  Modules may either be defined in the same file as their components (this works well for a module that contains exactly one service) or in a separate file for wiring pieces together.
  Why? A module should be consistent for anyone that wants to include it as a reusable component. If a module can mean different things depending on which files are included, it is not consistent.
  https://google-styleguide.googlecode.com/svn/trunk/angularjs-google-style.html#modules
*/
window.AirPair = angular.module("AirPair", ['firebase','angularMoment','ui.bootstrap'])
  .run(['$rootScope', function($rootScope) {
    // set globals we want available in ng expressions
    $rootScope._ = window._;
    $rootScope.moment = window.moment;
  }])
