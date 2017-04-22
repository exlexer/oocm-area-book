'use strict';

angular.module('antiPad.totals',[])
	.controller('totalsController', ['$scope','$rootScope','$http', function($scope,$rootScope,$http) {
		var lead = $rootScope.leadership;

		if (lead === undefined || lead === 'miss') {
			$http.get('/numbers').then(function (resp) {
				$scope.data = resp.data;
			});
		} else {
			$http.post('/numbers', {leadership : lead}).then(function (resp) {
				console.log(resp);
				$scope.data = resp.data;
			});
		}

	}]);