const Instagram = require('node-instagram').default;

// Create a new instance.
const instagram = new Instagram({
    clientId: '2107055339371598',
    clientSecret: '1863184385759cdc71227cf5dc543fa1',
    accessToken: 'd5118543fbd03b8aac1a849110a76702',
  });

// Your redirect url where you will handle the code param
const redirectUri = 'http://localhost:3000/auth/instagram/callback';

function searchinstagramfeeds(req, res){
    /* ig.deepScrapeTagPage('instablog9ja').then(result => {
        // console.dir(result);
        res.end(JSON.stringify(result))
    }); */
    res.redirect(
        instagram.getAuthorizationUrl(
          redirectUri,
          {
            // an array of scopes
            scope: ['basic', 'likes'],
          },
        )
      );
}

async function authCallBack(req, res) {
    try {
        // The code from the request, here req.query.code for express
        const code = req.query.code;
        const data = await instagram.authorizeUser(code, redirectUri);
        // data.access_token contain the user access_token
        res.json(data);
      } catch (err) {
        res.json(err);
      }
}


module.exports = {
    searchinstagram: searchinstagramfeeds,
    instagramAuthCallBack: authCallBack,
}