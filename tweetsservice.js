var Twitter = require('twitter');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

/* var Twit = require('twit')

var T = new Twit({
  consumer_key: 'X2ln4ZX5sAj32VSSlwrNq7LLm',
  consumer_secret:  'mCGRBwIcXzCODUfZiPidcgw4I0siaC9y0NzdCIkkrpOeysjtrP',
  access_token: '1317857354273247232-GCRrPIDhXbRC4L9TpwPK1jdnDtdEno',
  access_token_secret:  'ttd5ckCgEMTov20uEWmV9xbatwxgCLJp9XESvrSAM3EOD',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
}) */

// new access_token = 1317857354273247232-GCRrPIDhXbRC4L9TpwPK1jdnDtdEno
// new token secret = ttd5ckCgEMTov20uEWmV9xbatwxgCLJp9XESvrSAM3EOD

/*var client = new Twitter({
    consumer_key: '3hZrLLxAGqO6dBsmvfJ87R56',
    consumer_secret: 'jPpMKLLF0s9MMMv9UvMLHYlhmbVzmFQelKcEhLmn0novc0Gop0',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAHej9wAAAAAAUZLbKnQTnsncYEY5tz1eLMRiO3Y%3DOyXr2stj6I1TujlNB90qGGrS5cBCTTkk1HonDIEbOvV2d12bby'
  });
  */
 var client = new Twitter({
  consumer_key: 'X2ln4ZX5sAj32VSSlwrNq7LLm',
  consumer_secret: 'mCGRBwIcXzCODUfZiPidcgw4I0siaC9y0NzdCIkkrpOeysjtrP',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAIPbIwEAAAAACzDSDOWexxJGSiGyOFljZeA2YHs%3D927NEobK2FwEPT0WLg5wZc1fI8LJOKVb2o8fPzeEwn2TEHECIZ'
});





  function getSentimentfortweet(tweet){
      let analysis = sentiment.analyze(tweet);
      return analysis;
  }

   function getTweetsByHashTag(req,res){
    let hash = req.query.hash;
    console.log('Hash:    '+hash)
    let arr = []
    client.get('search/tweets', {q: hash,count:20,lang:'en'}, function(error, tweets, response) {
        //console.log(tweets)
        let count = tweets.statuses.length;
        let val = 0;
        console.log(count)
       tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let cal = analysis.calculation;
          // let image = tweet.user.profile_image_url;
          // console.log(tweet.user.profile_image_url)
         if(cal[0]!=null){
   
          for ( var property in cal[0] ) {
            //console.log( property ); // Outputs: foo, fiz or fiz, foo
           let category = property;
           let rating =  cal[0][property];
           let tweettext = dd;
           // let img = image;
           val = val+parseInt(rating)
            arr.push({
              rating:rating,
              category:category,
              tweet:tweettext,
              //imageUrl: img
              id: tweet.id,
              imageUrl: tweet.user.profile_image_url,
              createdAt: tweet.created_at
            })
          }
         }
       });
       if(arr.length>0){
        // console.log(arr)
        console.log(val)
        arr.push({
          overallrating:val
        })
        res.end(JSON.stringify(arr))
        // res.send(JSON.stringify(tweets))
       }
       else{
           res.end('No data for this search')
       }
    }); 
  }

 

  function getTweetRating(req,res){
    let hash = req.query.hash;
   // console.log('Hash:    '+hash)
    client.get('search/tweets', {q: hash,count:100,lang:'en'}, function(error, tweets, response) {
        //console.log(tweets)
        //let count = tweets.statuses.length;
        let val = 0; 
        let positives = 0;
        let negatives = 0;
        //console.log(count)
       tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let cal = analysis.calculation;
         // console.log(cal) 
         if(cal[0]!=null){
            for ( var property in cal[0] ) {
            let rating =  cal[0][property];
            //console.log(rating)
            if(rating >= 0){
              positives = positives + 1;
            }
            if( rating < 0){
              negatives = negatives + 1;
            }
            val = val+parseInt(rating)
            }
         }
       });
       if(val!=null){
        res.end(JSON.stringify({
          val: val,
          negatives: negatives,
          positives: positives
        }))
       }
       else{
           res.end('No data for this search')
       }
    }); 
  }

  function getTweetRatingforHashTags(req,res){
    let hashkey = req.query.hash;
    let arr = [];
    let hashes = hashkey.split(',');
    console.log(hashes)
    hashes.forEach(async (hash) => {
      let val = 0;
      let positives = 0;
      let negatives = 0;
      client.get('search/tweets', {q: hash,count:20,lang:'en'}, function(error, tweets, response) {
        let count = 0;
        tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let cal = parseInt(analysis.score)
          if(cal > 0){
            positives++;
          }
          if(cal < 0){
            negatives++;
          }
          val = val + cal;
          count = count + 1;
          if(tweets.statuses.length == count){
            arr.push({
              hashTag: hash,
              val: val,
              positives: positives,
              negatives: negatives,
            })
            console.log(arr)
            if(arr.length == hashes.length){
              res.end(JSON.stringify(arr))
            }
          }
        });
      });
    })
  }

  function getpositivetweetsforhashTags(req,res){
    let hash = req.query.hash;
    console.log('Hash:    '+hash)
    let arr = []
    client.get('search/tweets', {q: hash,count:20,lang:'en'}, function(error, tweets, response) {
        //console.log(tweets)
        let count = tweets.statuses.length;
        let val = 0;
        // console.log(count)
       tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let score = analysis.score;
          let call = analysis.calculation;
          let words = [];
          // console.log(call)
          if(score > 0 ){
            if(call[0]!=null){
   
          for ( var property in call[0] ) {
            console.log( property ); // Outputs: foo, fiz or fiz, foo
            words.push(property);
            arr.push({
              rating:words,
              tweet:dd,
              //imageUrl: img
              id: tweet.id,
              imageUrl: tweet.user.profile_image_url,
              createdAt: tweet.created_at
            })
          }
         }
          }
       });
       if(arr.length>0){
        // console.log(arr)
        res.end(JSON.stringify(arr))
       }
       else{
           res.end('No data for this search')
       }
    }); 
  }

  function getnegativetweetsforhashTags(req,res){ 
    let hash = req.query.hash;
    console.log('Hash:    '+hash)
    let arr = []
    client.get('search/tweets', {q: hash,count:20,lang:'en'}, function(error, tweets, response) {
        //console.log(tweets)
        let count = tweets.statuses.length;
        let val = 0;
        // console.log(count)
       tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let score = analysis.score;
          let call = analysis.calculation;
          let words = [];
          // console.log(call)
          if(score < 0 ){
            if(call[0]!=null){
   
          for ( var property in call[0] ) {
            console.log( property ); // Outputs: foo, fiz or fiz, foo
            words.push(property);
            arr.push({
              rating:words,
              tweet:dd,
              //imageUrl: img
              id: tweet.id,
              imageUrl: tweet.user.profile_image_url,
              createdAt: tweet.created_at
            })
          }
         }
          }
       });
       if(arr.length>0){
        // console.log(arr)
        res.end(JSON.stringify(arr))
       }
       else{
           res.end('No data for this search')
       }
    }); 
  }

  module.exports = {
    gettweetbyhash: getTweetsByHashTag,
    getTweetRating:getTweetRating,
    getTweetRatingforHashTags: getTweetRatingforHashTags,
    getPositiveTweetsForHashtag: getpositivetweetsforhashTags,
    getNegativeTweetsForHashtag: getnegativetweetsforhashTags,
  };