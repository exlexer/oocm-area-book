'use strict';

angular.module('antiPad.main',[])
	.controller('mainController', ['$rootScope','$scope','$location','$http', '$state', function($rootScope, $scope, $location, $http, $state) {

		$scope.logout = function() {
			$http.get('/logout');
		}

   	$scope.notifyServiceOnChage = function(){
  	};

	}])
	.directive('resize', function ($window) {
    return function (scope, element, attr) {

        var w = angular.element($window);
        console.log(w);
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

            		console.log(leftEl, width)

            		console.log(menu);

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