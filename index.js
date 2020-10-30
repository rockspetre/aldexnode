var express  =require('express');
var app = express();
var cors = require('cors')
app.use(express.json());
var bodyParser = require('body-parser');
var tweetservcice  = require('./tweetsservice');
var instagramservice = require('./instagramservice');
var trends = require('./trends');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/getTweetsByHashTag',(req,res)=>{
    tweetservcice.gettweetbyhash(req,res)
})

app.get('/gettrends',(req,res)=>{
    trends.getTrends(req,res)
})

app.get('/getInterestByRegion', (req, res) => {
    trends.getInyterestByRegion(req, res);
})

app.get('/getTweetRating',(req,res)=>{
    tweetservcice.getTweetRating(req,res)
})

app.get('/getPositiveTweetsForHashtags', (req, res) => {
    tweetservcice.getPositiveTweetsForHashtag(req, res);
})

app.get('/getNegativeTweetsForHashtags', (req, res) => {
    tweetservcice.getNegativeTweetsForHashtag(req, res);
})

app.get('/getMultipleTweetRatings',(req,res)=>{
    tweetservcice.getTweetRatingforHashTags(req,res)
})

app.get('/getInterestOverTime',(req,res)=>{
    trends.getInterestOvertime(req,res)
})

app.get('/getRelatedTopics',(req,res)=>{
    trends.getPotentialTopics(req,res)
})
app.get('/getCountryCodes',(req,res)=>{
    trends.getCountryCodes(req,res)
})

app.get('/searchinstagram', (req, res) => {
    instagramservice.searchinstagram(req, res)
})

app.get('/auth/instagram/callback', (req, res) => {
    instagramservice.instagramAuthCallBack(req, res);
})

app.get('/', (req, res) => {
    res.send('Aldex backend Working')
})

app.listen(3000,()=>{console.log('app listening')})