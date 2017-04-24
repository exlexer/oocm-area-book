'use strict';

angular.module('areaBook.main',[])
	.controller('mainController', ['$scope', function($scope) {
	
  	$scope.logout = function() { $http.get('/logout'); }
	
  }]);
