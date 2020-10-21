const googleTrends = require('google-trends-api');
const lookup = require('country-code-lookup');

function getInyterestByRegion(req, res){
    googleTrends.interestByRegion({keyword: 'laycon', startTime: new Date('2017-02-01'), endTime: new Date(), geo: 'NG'})
    .then((response) => {
    //console.log(res);
    res.end(response)
    }).catch((err) => {
        console.log(err);
    })
}


function getTrends(req,res){
    let date = req.query.date;
    // let dd = date.split(',')
    // console.log(dd);
    let arr = [];
    let dr = lookup.byCountry(date)
    console.log(dr)
    let geoname = ''
    if(dr==null){
        geoname = 'US';
    }else{
        geoname = dr.iso2;
    }
    //console.log(dr)
    googleTrends.dailyTrends({
        trendDate: new Date(),
        geo: geoname,
        keyword: 'trump'
      }, function(err, results) {
        if (err) {
            res.status(500).send({ error: err });
          // console.log(err);
        }else{
          //console.log(results);
          let obj = JSON.parse(results);
          let dd = obj.default.trendingSearchesDays;
          for(let i=0;i<dd.length;i++){
            let innerobj = obj.default.trendingSearchesDays[i].trendingSearches;
            if(innerobj!=null){
                for(let i=0;i<innerobj.length;i++){
                    let dat = innerobj[i];
                    let innerarr=[]; 
                    let title = dat.title.query;
                    let image = dat.image.imageUrl
                    let newsurl = dat.image.newsUrl;
                    let articles = dat.articles;
                    let articlecount = articles.length; 
                    let first = articles[0].snippet
                    articles.forEach((child)=>{
                        innerarr.push(child)
                    })
                    arr.push({
                        title:title,
                        image:image,
                        newsUrl:newsurl,
                        count:'There are '+articlecount+' article(s) under this topic',
                        first:first,
                        articles:innerarr
                    })
                }
            }
          }
 
          res.send(arr)
        }
      });
}


function getInterestOvertime(req,res){
    let arr = [];
    let key = req.query.key;
    console.log(key)
    let country = req.query.country;
    console.log(country)
    let code = lookup.byCountry(country)
    console.log(code)
    googleTrends.interestByRegion({keyword: key,  startTime: new Date('2017-02-01'), endTime: new Date(), geo: code.iso2})
    .then((result) => {
        const dd = JSON.parse(result);
        // console.log(dd);
        let data = dd.default.geoMapData;
        for(let i=0;i<data.length;i++){
            let innerdata = data[i];
            let name = innerdata.geoName;
            let rating = innerdata.value[0]
            // console.log(name+' '+rating)
            arr.push({
                name:name,
                rating:rating
            }) 
        }
        res.send(arr)
    })
    .catch((err) => {
        res.send(err)
      console.log(err);
    })
}

function getRelatedTopics(req,res){
    let arr=[]
    let key = req.query.key;
    let country = req.query.country;
    console.log(country)
    let code = lookup.byCountry(country)
    googleTrends.relatedQueries({keyword: key, geo:code.iso2})
.then((result) => {
  // console.log(result);
  res.end(result)
})
.catch((err) => {
  console.log(err);
})
}

module.exports={
    getInyterestByRegion:getInyterestByRegion,
    getInterestOvertime:getInterestOvertime,
    getPotentialTopics:getRelatedTopics,
    getTrends:getTrends
}