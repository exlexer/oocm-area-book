'use strict';

angular.module('areaBook.areaBook',[])
	.controller('areaBookController', ['$scope','$rootScope','$http','$state','$stateParams', function($scope, $rootScope, $http, $state, $stateParams) {
		
		function update() {
			$http.get('/inv').then(function (resp) {
				$scope.inv = resp.data;
			}, function() {});
			$http.get('/rc').then(function (resp) {
				$scope.rc = resp.data;
			}, function() {});
			$http.get('/lesson').then(function (resp) {
				$scope.lessons = resp.data;
			}, function() {});
		};
		update();

		$scope.openInv = function (id) {
			$scope.focus = true;
			$scope.current = $scope.inv[id];
		}

		$scope.closeFocus = function () {
			$scope.focus = false;
			$scope.current = null;
		}

		$scope.downloadFocus = function () {
			$http.post('/record', {}).then(function (resp) {
				console.log($scope.current);
				var doc = new PDFDocument;
				var stream = doc.pipe(blobStream());
				
				doc.fontSize(25)
					.text($scope.current.name)
					.moveDown()
					.fontSize(18)
					.text('Unit: '+$scope.current.unit+' Age: '+$scope.current.age+' Gender: '+$scope.current.gender+' Baptismal Date: '+$scope.current.bd);

				doc.fontSize(12);

				for (var i = 0; i < $scope.lessons.length; i++) {
					doc.moveDown()
							.text(resp.data.lessons[i].summary);
				};

				doc.end()
				stream.on('finish', function() {
	  			var blob = stream.toBlob('application/pdf')
					
	  			var url = stream.toBlobURL('application/pdf')
	  			window.open(url);
				})
			});
		}

		$scope.openRc = function (id) {
			$scope.focus = true;
			$scope.current = $scope.rc[id];
		}

	}]);