const getBearerToken = require('get-twitter-bearer-token')
const twitter_consumer_key = '3hZrLLxAGqO6dBsmvfJ87R56'
const twitter_consumer_secret = 'jPpMKLLF0s9MMMv9UvMLHYlhmbVzmFQelKcEhLmn0novc0Gop0'
 
getBearerToken(twitter_consumer_key, twitter_consumer_secret, (err, res) => {
  if (err) {
    // handle error
    console.log(err)
  } else {
  
    // bearer token
    console.log(res.body.access_token)
  }
})