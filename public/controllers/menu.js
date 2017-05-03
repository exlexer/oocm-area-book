'use strict';

angular.module('areaBook.menu',[])
	.controller('menuController', ['$scope','$rootScope','$state','$http', function($scope, $rootScope, $state, $http) {
		$scope.showTab = function(view) {
			$state.go('app.menu.' + view);
		};
		
		$scope.menu = []

		var area = ['Areas', 'areas'],
				total = ['Totals', 'totals'],
				areaBook = ['Area Book', 'areaBook'];

		var leadership = {
			pres : [area, total],
			asst : [area, total, areaBook],
			zone : [total, areaBook],
			dist : [total, areaBook],
			estl : [total, areaBook],
			miss : [total, areaBook]
		};

		$http.get('/user').then(function (resp) {
			console.log(resp);
			$rootScope.leadership = !!resp.data[0].leadership ? resp.data[0].leadership : 'miss';
			$rootScope.areaId = resp.data[0].areaId;
			$rootScope.name = resp.data[0].name;
			$scope.menu = leadership[$rootScope.leadership];
    });
	}]);