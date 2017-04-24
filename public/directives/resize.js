'use strict';

angular.module('areaBook.resize',[])
	.directive('resize', function ($window) {
  
  return function (scope, element, attr) {

    var w = angular.element($window);

    scope.$watch(function () {
      return {
        'h': w[0].innerHeight,
        'w': w[0].innerWidth
      };
    }, function (newValue, oldValue) {
      scope.windowHeight = newValue.h;
      scope.windowWidth = newValue.w;

      scope.resizeWithOffset = function (offsetH, leftEl) {

      		var width = !leftEl ? 0 : document.getElementById(leftEl).clientWidth;

        scope.$eval(attr.notifier);

        return { 
          'height': (newValue.h - offsetH) + 'px',
          'width': (newValue.w - width) + 'px' 
        };
      };

    }, true);

    w.bind('resize', function () {
      scope.$apply();
    });
  }
});