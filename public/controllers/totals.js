'use strict';

angular.module('areaBook.totals',[])
	.controller('totalsController', ['$scope','$rootScope','$http', function($scope,$rootScope,$http) {
		var lead = $rootScope.leadership;

		$http.post('/numbers', {leadership : lead}).then(function (resp) {
			console.log(resp);
			$scope.data = resp.data;
		});

	}]);