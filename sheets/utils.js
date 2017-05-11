var ss = require('./ss.js');
var dbUtils = require('../db/utils.js');
var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var sheets = google.sheets('v4');


// Creates new sheet, accepts a title for the sheet and a callback taking params of err and response
var createSheet = function (title, cb, authCb) {
	ss.auth(function (auth) {
			sheets.spreadsheets.create({
			resource: {
				properties: {
					title: title
				}
			},
			auth: auth
			}, cb);
  	}, authCb);
};

function storeToken (code, cb) {
	ss.recieveToken(code, cb);
}

// only workswhen there are less actives
function exportRc(stakeId, cb) {
	dbUtils.getStakeRcs(stakeId, function (error, response) {
		// If there is a spreadsheet made for stake, it updates sheet and
		// sends url. if there is no sheet, it creates sheet, updates it and sends it.
		if (!response[0].sheetId) {
			createSheet(response[0].stakeName, function (err,res) {
				dbUtils.updateSheetId(stakeId, res.spreadsheetId)
				updateSheet(res.spreadsheetId, 'A1', createValMatrix(response), cb);
				cb(res.spreadsheetUrl);
			}, cb)
		} else {
			updateSheet(response[0].sheetId, 'A1', createValMatrix(response), cb);
  		cb('https://docs.google.com/spreadsheets/d/' + response[0].sheetId + '/edit');
		}
	})
};

function updateSheet (id, range, vals, cb) {
	ss.auth(function (auth) {
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
};


function readSheet (id, range, cb) {
	ss.auth(function (auth) {
		sheets.spreadsheets.values.get({
			spreadsheetId: id,
			range: range,
			auth: auth
		}, cb);
	})
}

function getSheets (id, cb, authCb) {
	ss.auth(function (auth) {
	  sheets.spreadsheets.get({
  		spreadsheetId: id,
  		ranges: [],
	    includeGridData: false,
	    auth: auth
		}, cb)
	}, authCb);
}

function createValMatrix (rcs) {
	var matrix = [['Current Unit', 'Name','Bishop/Branch President','Age','Gender','Date Confirmed','Status','Attended Church this month','Responsibility/Calling','Home Teacher','Visiting Teachers','Temple']];

	for (var i = 0; i < rcs.length; i++) {
		var rc = rcs[i];
		matrix.push([rc.unit, rc.name,, rc.age, rc.gender, rc.bd,,, rc.hters, rc.vters,]);
	};
	return matrix;
};

module.exports = {
	exportRc: exportRc,
	storeToken: storeToken,
	readSheet: readSheet,
	getSheets: getSheets
};

