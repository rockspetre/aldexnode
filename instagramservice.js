var ig = require('instagram-scraping');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

function getSentimentfortweet(tweet){
  let analysis = sentiment.analyze(tweet);
  return analysis;
}

function searchinstagramfeeds(req, res){ 
  let arr = [];
  let tag = req.query.hash;
     ig.scrapeTag(tag).then(result => {
        // console.dir(result);
        // console.log(tag)
         res.end(JSON.stringify(result.medias.map((x) => {
          let score = getSentimentfortweet(x.text);
          let call = score.calculation;
          let words = [];
          for ( var property in call[0] ) {
            words.push(property);
          } 
           return {
             text: x.text,
             image: x.display_url,
             likes: x.like_count,
             comments: x.comment_count,
             score: score.score,
             tag: tag,
             words: words
           }
         })))
    })
    
}

/*
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
*/




module.exports = {
    searchinstagram: searchinstagramfeeds
}