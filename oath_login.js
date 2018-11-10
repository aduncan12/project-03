let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')

let app = express()

app.use(cors())

let redirect_uri = 'http://localhost:8888/callback'

app.get('/spotify', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    let access_token = body.access_token
    let uri = 'http://localhost:3000/main'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

let port = process.env.PORT || 3000
console.log(`Listening on port ${port}. Go /spotify to initiate authentication flow.`)
app.listen(port)