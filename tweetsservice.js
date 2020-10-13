var Twitter = require('twitter');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

var client = new Twitter({
    consumer_key: '3hZrLLxAGqO6dBsmvfJ87R56',
    consumer_secret: 'jPpMKLLF0s9MMMv9UvMLHYlhmbVzmFQelKcEhLmn0novc0Gop0',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAHej9wAAAAAAUZLbKnQTnsncYEY5tz1eLMRiO3Y%3DOyXr2stj6I1TujlNB90qGGrS5cBCTTkk1HonDIEbOvV2d12bby'
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
    let hashkey = req.query.hash;
    let arr = [];
    let hashes = hashkey.split(',');
    let count = 0;
    console.log(hashes)
    hashes.forEach(async (hash) => {
      client.get('search/tweets', {q: hash,count:20,lang:'en'}, function(error, tweets, response) {
        tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let cal = parseInt(analysis.score)
          if(cal > 0){
            arr.push({
              text: tweet.text,
              id: tweet.id,
              imageUrl: tweet.user.profile_image_url,
              createdAt: tweet.created_at,
              hashTag: hash,
            })
            count = count + 1;
          }
        });
        if(arr.length == hashes.length*count){
          res.end(JSON.stringify(arr))
        }
      });
    })
  }

  function getnegativetweetsforhashTags(req,res){
    let hashkey = req.query.hash;
    let arr = [];
    let hashes = hashkey.split(',');
    console.log(hashes)
    hashes.forEach(async (hash) => {
      client.get('search/tweets', {q: hash,count:20,lang:'en'}, function(error, tweets, response) {
        let count = 0;
        tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let cal = parseInt(analysis.score)
          if(cal < 0){
            arr.push({
              text: tweet.text,
              id: tweet.id,
              imageUrl: tweet.user.profile_image_url,
              createdAt: tweet.created_at,
              hashTag: hash,
            })
          }
        });
      });
      res.end(JSON.stringify(arr))
    })
  }

  module.exports = {
    gettweetbyhash: getTweetsByHashTag,
    getTweetRating:getTweetRating,
    getTweetRatingforHashTags: getTweetRatingforHashTags,
    getPositiveTweetsForHashtag: getpositivetweetsforhashTags,
    getNegativeTweetsForHashtag: getnegativetweetsforhashTags,
  };