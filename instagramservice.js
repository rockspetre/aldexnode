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
        // res.end(JSON.stringify(result.medias))
        var bar = new Promise((resolve, reject) => {
          result.medias.forEach((value, index, array) => {
              // console.log(value);
              let score = getSentimentfortweet(value.text.replace(/(\.|\,|\!)/g, '').replace('\\n', ''));
              let call = score.calculation;
              let words = [];
              for ( var property in call[0] ) {
                words.push(property);
              }
              arr.push({
                tag: tag,
                score: score.score,
                 words: words,
                text: value.text.replace('\\n', ' '),
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


async function authCallBack(req, res) {

}


module.exports = {
    searchinstagram: searchinstagramfeeds,
    instagramAuthCallBack: authCallBack,
}