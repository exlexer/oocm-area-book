var ss = require('./ss.js');
var dbUtils = require('../db/utils.js');
var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var sheets = google.sheets('v4');


// Creates new sheet, accepts a title for the sheet and a callback taking params of err and response
module.exports = {
	createSheet: function (title, cb, authCb) {
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
	},

	storeToken: function (code, cb) {
		ss.recieveToken(code, cb);
	},

	// only workswhen there are less actives
	exportRc: function(stakeId, cb) {
		var utils = this;
		dbUtils.getStakeRcs(stakeId, function (error, response) {
			// If there is a spreadsheet made for stake, it updates sheet and
			// sends url. if there is no sheet, it creates sheet, updates it and sends it.
			if (!response[0].sheetId) {
				utils.createSheet(response[0].stakeName, function (err,res) {
					dbUtils.updateSheetId(stakeId, res.spreadsheetId)
					utils.updateSheet(res.spreadsheetId, 'A1', utils.formatVals(response), cb);
					cb(res.spreadsheetUrl);
				}, cb)
			} else {
				utils.updateSheet(response[0].sheetId, 'A1', utils.formatVals(response), cb);
	  		cb('https://docs.google.com/spreadsheets/d/' + response[0].sheetId + '/edit');
			}
		})
	},

	updateSheet: function (id, range, vals, cb) {
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
	},

	readSheet: function (id, range, cb) {
		ss.auth(function (auth) {
			sheets.spreadsheets.values.get({
				spreadsheetId: id,
				range: range,
				auth: auth
			}, cb);
		})
	},

	getSheets: function (id, cb, authCb) {
		ss.auth(function (auth) {
		  sheets.spreadsheets.get({
	  		spreadsheetId: id,
	  		ranges: [],
		    includeGridData: false,
		    auth: auth
			}, cb)
		}, authCb);
	},

	formatVals: function (rcs) {
		var matrix = [['Current Unit', 'Name','Bishop/Branch President','Age','Gender','Date Confirmed','Status','Attended Church this month','Responsibility/Calling','Home Teacher','Visiting Teachers','Temple']];

		for (var i = 0; i < rcs.length; i++) {
			var rc = rcs[i];
			matrix.push([rc.unit, rc.name,, rc.age, rc.gender, rc.bd,,, rc.hters, rc.vters,]);
		};
		return matrix;
	}

};
