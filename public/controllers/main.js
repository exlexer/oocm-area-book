'use strict';

angular.module('areaBook.main',[])
	.controller('mainController', ['$scope', '$rootScope', '$http', function($scope,$rootScope,$http) {
	
  	$scope.logout = function () { $http.get('/logout'); }
		
		$scope.userEdit = false;

		$scope.openUserEdit = function () {
			$scope.userEdit = !$scope.userEdit;
			$scope.user = {
				name : $rootScope.name,
				email : $rootScope.email,
				password : undefined,
				newPassord : undefined
			};
		};

		$scope.saveUserEdit = function () {
			$http.post('/user', $scope.user).then(function (resp) {
				console.log(resp);
				$scope.openUserEdit()
			})
		}

  }]);