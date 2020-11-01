var ig = require('instagram-scraping');
var Sentiment = require('sentiment');
let Instagram = require('instagram-nodejs-without-api');
Instagram = new Instagram()
var sentiment = new Sentiment();


function getSentimentfortweet(tweet){
  let analysis = sentiment.analyze(tweet);
  return analysis;
}

/* function searchinstagramfeeds(req, res){ 
  Instagram.getCsrfToken().then((csrf) =>
  {
    Instagram.csrfToken = csrf;
  }).then(() =>
  {
    return Instagram.auth('rockspetre', 'pajagu').then(sessionId =>
    {
      Instagram.sessionId = sessionId
  
      return Instagram.getUserDataByUsername('sayhofesh').then((t) =>
      {
        return Instagram.getUserFollowers(t.graphql.user.id).then((t) =>
        {
          console.log(t); // - instagram followers for user "username-for-get"
        })
      })
  
    })
  }).catch(console.error);
    
} */




function searchinstagramfeeds(req, res){ 
  let arr = [];
  let tag = req.query.hash;
     ig.scrapeTag(tag).then(result => {
        // console.dir(result);
        // console.log(tag)
        // res.end(JSON.stringify(result.medias))
        var bar = new Promise((resolve, reject) => {
          result.medias.forEach((value, index, array) => {
              // console.log(value);
              let score = getSentimentfortweet(value.text);
              let call = score.calculation;
              let words = [];
              for ( var property in call[0] ) {
                words.push(property);
              } 
              arr.push({
                tag: tag,
                score: score.score,
                 words: words,
                text: value.text,
                image: value.display_url,
                likes: value.like_count,
                comments: value.comment_count,
              });
              if (index === array.length -1) resolve(); 
          });
      }); 
      bar.then(() => { 
        // console .log(arr)
        res.end(JSON.stringify(arr))
      })
    })
    
}





module.exports = {
    searchinstagram: searchinstagramfeeds
}