angular.module('areaBook.areaBook',[])
	.controller('areaBookController', ['$scope','$rootScope','$http','$state','$stateParams', function($scope, $rootScope, $http, $state, $stateParams) {
		
		function update() {
			$http.get('/inv').then(function (resp) {
				$scope.inv = resp.data
			}, function() {})
			$http.get('/rc').then(function (resp) {
				$scope.rc = resp.data
			}, function() {})
			$http.get('/former').then(function (resp) {
				$scope.former = resp.data
			}, function() {})
			$http.get('/lesson').then(function (resp) {
				$scope.lessons = resp.data
			}, function() {})
		}
		update()

		$scope.openInv = function (id) {
			$scope.focusEdit = false
			$scope.focus = true
			$scope.current = $scope.inv[id]
		}

		$scope.openRc = function (id) {
			$scope.focusEdit = false
			$scope.focus = true
			$scope.current = $scope.rc[id]
		}

		$scope.openFormer = function (id) {
			$scope.focusEdit = false
			$scope.focus = true
			$scope.current = $scope.former[id]
		}

		$scope.redate = function (date) {
			date = new Date(date)
			var format = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear()
			return format
		}

		$scope.editFocus = function () {
			$scope.focusEdit = true
		}

		$scope.closeFocus = function () {
			$scope.focus = false
			$scope.current = null
		}

		$scope.saveFocus = function () {
			$scope.focusEdit = false
			console.log($scope.current)
			if (!$scope.current.unit) {
				$http.post('/inv', $scope.current).then(function (resp) {
					console.log(resp)
				})
			} else {
				$http.post('/rc', $scope.current).then(function (resp) {
					console.log(resp)
				})
			}
			// save focus edits!
		}
		$scope.filterLessons = function() {
			return function (lesson) {
				if ($scope.current) {
					return lesson.id === $scope.current.id && lesson.name === $scope.current.name
				} else {
					return false
				}
			}
		}

		$scope.downloadFocus = function () {
			var doc = new PDFDocument
			var stream = doc.pipe(blobStream())
			
			var data = ['Unit', 'Age', 'Gender', 'BD']
			var str = ''

			for (var i = 0; i < data.length; i++) {
				if($scope.current[data[i].toLowerCase()]) {
					str = str + data[i] + ': ' + $scope.current[data[i].toLowerCase()] + '   '	
				}
			}

			doc.fontSize(25)
				// .image('img/logo.jpeg')
				.text($scope.current.name, {align: 'center'})
				.fontSize(18)
				.text(str)

			doc.fontSize(12)

			doc.text('Phone Number: ' + ($scope.current.phoneNumber || ''))
				.text('Address: ' + ($scope.current.address || ''))
				.text('Summary: ' + ($scope.current.summary || ''))

			for (var i = 0; i < $scope.lessons.length; i++) {
				if ($scope.lessons[i].id === $scope.current.id && $scope.lessons[i].name === $scope.current.name) {

					var lesson = $scope.lessons[i]

					doc.moveDown()
						.text($scope.redate(lesson.OrderDate) + ' - ' + lesson.summary)
				}
			}

			doc.info.Title = $scope.current.name + ' Teaching Record'

			doc.end()
			stream.on('finish', function() {
  			window.open(stream.toBlobURL('application/pdf'))
			})
		}

	}])