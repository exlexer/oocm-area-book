'use strict';

angular.module('areaBook.areaBook',[])
	.controller('areaBookController', ['$scope','$rootScope','$http','$state','$stateParams', function($scope, $rootScope, $http, $state, $stateParams) {
		
		function update() {
			$http.get('/inv').then(function (resp) {
				console.log(resp)
				$scope.inv = resp.data;
			}, function() {});
			$http.get('/rc').then(function (resp) {
				$scope.rc = resp.data;
			}, function() {});
			$http.get('/former').then(function (resp) {
				$scope.former = resp.data;
			}, function() {});
			$http.get('/lesson').then(function (resp) {
				console.log(resp.data);
				$scope.lessons = resp.data;
			}, function() {});
		};
		update();

		$scope.openInv = function (id) {
			$scope.focus = true;
			$scope.current = $scope.inv[id];
		}

		$scope.openRc = function (id) {
			$scope.focus = true;
			$scope.current = $scope.rc[id];
		}

		$scope.openFormer = function (id) {
			$scope.focus = true;
			$scope.current = $scope.former[id];
		}

		$scope.redate = function (date) {
			date = new Date(date);
			var format = date.getDay() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
			return format;
		}

		$scope.editFocus = function () {
			$scope.focusEdit = true;
		}

		$scope.closeFocus = function () {
			$scope.focus = false;
			$scope.current = null;
		}

		$scope.saveFocus = function () {
			$scope.focusEdit = false;
			console.log($scope.current)
			$http.post('/inv')
			// save focus edits!
		}
		$scope.filterLessons = function() {
			return function (lesson) {
				return lesson.id === $scope.current.id || lesson.name === current.name;
			}
		}

		$scope.downloadFocus = function () {
			var doc = new PDFDocument;
			var stream = doc.pipe(blobStream());
			
			var data = ['Unit', 'Age', 'Gender', 'BD'];
			var str = '';

			for (var i = 0; i < data.length; i++) {
				if($scope.current[data[i].toLowerCase()]) {
					str = str + data[i] + ': ' + $scope.current[data[i].toLowerCase()] + '   ';	
				}
			};

			doc.fontSize(25)
				.text($scope.current.name)
				.moveDown()
				.fontSize(18)
				.text(str);

			doc.fontSize(12);

			for (var i = 0; i < $scope.lessons.length; i++) {
				if ($scope.lessons[i].id === $scope.current.id || $scope.lessons[i].name === $scope.current.name) {

					var lesson = $scope.lessons[i];

					doc.moveDown()
						.text($scope.redate(lesson.OrderDate) + ' - ' + lesson.summary);
				}
			};

			doc.end()
			stream.on('finish', function() {
  			window.open(stream.toBlobURL('application/pdf'));
			})
		}

	}]);