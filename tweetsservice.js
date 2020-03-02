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
    client.get('search/tweets', {q: hash,count:10,lang:'en'}, function(error, tweets, response) {
        //console.log(tweets)
        let count = tweets.statuses.length;
        let val = 0;
        console.log(count)
       tweets.statuses.forEach(function(tweet) {
          let dd = tweet.text;
          let analysis = getSentimentfortweet(dd);
          let cal = analysis.calculation;
         if(cal[0]!=null){
   
          for ( var property in cal[0] ) {
            //console.log( property ); // Outputs: foo, fiz or fiz, foo
           let category = property;
           let rating =  cal[0][property];
           let tweettext = dd;
           val = val+parseInt(rating)
            arr.push({
              rating:rating,
              category:category,
              tweet:tweettext
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
       }
       else{
           res.end('No data for this search')
       }
    }); 
  }
 

  function getTweetRating(req,res){
    let hash = req.query.hash;
    console.log('Hash:    '+hash)
    client.get('search/tweets', {q: hash,count:100,lang:'en'}, function(error, tweets, response) {
        //console.log(tweets)
        //let count = tweets.statuses.length;
        let val = 0;
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
            val = val+parseInt(rating)
            }
         }
       });
       if(val!=null){
        res.end(JSON.stringify(val))
       }
       else{
           res.end('No data for this search')
       }
    }); 
  }

  module.exports = {
    gettweetbyhash: getTweetsByHashTag,
    getTweetRating:getTweetRating
  };