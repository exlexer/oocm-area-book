var fs = require('fs')
var readline = require('readline')
var google = require('googleapis')
var googleAuth = require('google-auth-library')


var SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/'
var TOKEN_PATH = TOKEN_DIR + 'sheets-credentials.json'

module.exports = {
  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   *
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  auth: function (cb, authCb) {

    var oauth2Client = getClient()

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, authCb)
      } else {
        oauth2Client.credentials = JSON.parse(token)
        cb(oauth2Client)
      }
    })
  },

  recieveToken: function (code) {
    var self = this;

    var oauth2Client = getClient()

    oauth2Client.getToken(code, (err, token) => {
      if (err) {
        console.log('Error while trying to retrieve access token', err)
        return;
      }
      oauth2Client.credentials = token;
      self.storeToken(token)
    })
  },


  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  storeToken: function (token) {
    try {
      fs.mkdirSync(TOKEN_DIR)
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token))
    console.log('Token stored to ' + TOKEN_PATH)
  }
}



function getNewToken (oauth2Client, cb) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  cb(authUrl)
}

// Does not work in Dev
function getClient () {
  var clientId = process.env.OAUTH_CLIENT_ID
  var clientSecret = process.env.OAUTH_CLIENT_SECRET
  var redirectUrl = process.env.SHEET_REDIRECT_URL
  var auth = new googleAuth()
  return new auth.OAuth2(clientId, clientSecret, redirectUrl)
}