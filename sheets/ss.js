var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets-credentials.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(cb, authCb) {


  var clientId = process.env.OAUTH_CLIENT_SECRET || "980683034451-l7k9t1h6sr82v4il32rruks7sh5gmkvj.apps.googleusercontent.com";
  var clientSecret = process.env.OAUTH_CLIENT_SECRET || "GQeQd6eoAEjD1RAMi-rMJXuh";
  var redirectUrl = process.env.SHEET_REDIRECT_URL || 'http://localhost:3000/redirectOAuth';
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);


  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, authCb);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      cb(oauth2Client);
    }
  });
};

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken (oauth2Client, cb) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  console.log('callback',cb);

  cb(authUrl, oauth2Client);
};

function recieveToken (code) {

  var clientId = process.env.OAUTH_CLIENT_SECRET || "980683034451-l7k9t1h6sr82v4il32rruks7sh5gmkvj.apps.googleusercontent.com";
  var clientSecret = process.env.OAUTH_CLIENT_SECRET || "GQeQd6eoAEjD1RAMi-rMJXuh";
  var redirectUrl = process.env.SHEET_REDIRECT_URL || 'http://localhost:3000/redirectOAuth';
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  oauth2Client.getToken(code, function (err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    oauth2Client.credentials = token;
    storeToken(token);
  });
}


/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken (token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

module.exports = {
  auth : authorize,
  recieveToken: recieveToken
};