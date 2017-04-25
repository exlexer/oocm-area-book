var ss = require('./ss.js');
var dbUtils = require('../db/utils.js');
var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var sheets = google.sheets('v4');

// Creates new sheet, accepts a title for the sheet and a callback taking params of err and response
var createSheet = function (title, cb) {
	run(function (auth) {
			sheets.spreadsheets.create({
			resource: {
				properties: {
					title: title
				}
			},
			auth: auth
			}, cb);
  	});
}

var run = function(cb) {
	fs.readFile('./sheets/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    ss(JSON.parse(content), cb)
  });
}

// WORKS!
function exportRc(stakeId) {
	dbUtils.getStakeRcs(stakeId, function (error, response) {
		if (!response[0].sheetId) {
			createSheet(response[0].stakeName, function(err,res) {
				dbUtils.updateSheetId(stakeId, res.spreadsheetId)
				updateSheet(res.spreadsheetId, 'A1', createValMatrix(response), function (err, res) {});
			})
		} else {
			console.log('recieved!');
			updateSheet(response[0].sheetId, 'A1', createValMatrix(response), function (err, res) {});
		}
	})
}

function updateSheet (id, range, vals, cb) {
	run(function(auth) {
		sheets.spreadsheets.values.append({
			spreadsheetId:id,
			range: range,
			valueInputOption: 'RAW',
			resource: {
				values: vals
			},
			auth: auth
		}, cb);
	})
}

function createValMatrix (rcs) {
	var matrix = [['Current Unit', 'Name','Bishop/Branch President','Age','Gender','Date Confirmed','Status','Attended Church this month','Responsibility/Calling','Home Teacher','Visiting Teachers','Temple']];

	for (var i = 0; i < rcs.length; i++) {
		var rc = rcs[i];
		matrix.push([rc.unit, rc.name,, rc.age, rc.gender, rc.bd,,, rc.hters, rc.vters,]);
	};
	return matrix;

}

// var writeReport = function(name, id) {
// 	if (!id) {
// 		createSheet(name, function (err, response) {
//   		console.log(JSON.stringify(response, null, 2));
// 		});
// 	} else {
// 		updateSheet(id, function (err, response) {
// 			console.log(err);
// 		});
// 	};
// }

// var readRcs = function() {
// 	run(function(auth) {
// 		sheets.spreadsheets.values.batchGet({
// 			spreadsheetId:'15opNpLnUXakSPQdhtMH5mKRyywRNhtxzsIqYyu1P054',
// 			ranges: [
// 			"'Lawton Stake'!A2:F69",
// 			"'Norman Stake'!A2:F66",
// 			"'OKC Stake'!A2:F67",
// 			"'Bartlesville Stake'!A2:F66",
// 			"'OKC South Stake'!A2:F59",
// 			"'Stillwater Stake'!A2:F83",
// 			"'Tulsa Stake'!A2:F52",
// 			"'Tulsa East Stake'!A2:F28"
// 			],
// 			auth: auth,
// 			valueRenderOption: 'FORMATTED_VALUE',
// 			dateTimeRenderOption: 'FORMATTED_STRING',
// 		}, function(err, response) {
//     	if (err) {
//       	console.log(err);
//       	return;
//     	}
//     	// fs.writeFile('test.json', JSON.stringify(response, null, 2), function(err) {
//     	// 	console.log(err)
//     	// } )
//     	parse(JSON.parse(response, null, 2));
//     	// console.log(JSON.stringify(response, null, 2));
// 		});
// 	});
// }

// function parse(json) {
// 	console.log(json[valueRanges]);
// 	var data = json[valueRanges][1][value];
// 	var people = []
// 	for (var i = 0; json.length > 1; i++) {
// 		var person = {
// 			name: json[i][1],
// 			age: json[i][3],
// 			gender: json[i][4],
// 			unit: json[i][0],
// 			bapDate: json[i][5],
// 		};
// 		people.push(person);
// 	};
// 	console.log(people);
// }


module.exports = {};

