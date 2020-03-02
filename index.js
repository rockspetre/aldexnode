var express  =require('express');
var app = express();
var cors = require('cors')
var firebase = require('firebase');
app.use(express.json());
var bodyParser = require('body-parser');
var tweetservcice  = require('./tweetsservice');
var trends = require('./trends');
var fbase = require('./fbase');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
var firebaseConfig = {
    apiKey: "AIzaSyAkA7vDIs0UJitojpt9OZ5oQNlpHbACaHE",
    authDomain: "makemeup-2bf71.firebaseapp.com",
    databaseURL: "https://makemeup-2bf71.firebaseio.com",
    projectId: "makemeup-2bf71",
    storageBucket: "makemeup-2bf71.appspot.com",
    messagingSenderId: "536766362231",
    appId: "1:536766362231:web:73495be2e9f72dab11cc72"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


app.get('/getTweetsByHashTag',(req,res)=>{
    tweetservcice.gettweetbyhash(req,res)
})

app.get('gettrends',(req,res)=>{
    trends.getTrends(req,res)
})

app.get('/getTweetRating',(req,res)=>{
    trends.getTrends(req,res)
    //tweetservcice.getTweetRating(req,res)
})

app.get('/getUserProducts',(req,res)=>{ 
    fbase.getuserproducts(req,res)
})

app.get('/getInterestOverTime',(req,res)=>{
    trends.getInterestOvertime(req,res)
})

app.get('/getPotentialCompetition',(req,res)=>{
    trends.getPotentialCompetition(req,res)
})
app.get('/getCountryCodes',(req,res)=>{
    trends.getCountryCodes(req,res)
})


app.listen(3000,()=>{console.log('app listening')}) 