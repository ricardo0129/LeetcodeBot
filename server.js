const express = require('express')
const app = express()
const utf8 = require('utf8')
const x = require('./submit.js')
const db = require('./db.js')
const { expToLvl, progressBar, ProgressMess } = require('./math.js')
var Mutex = require('async-mutex').Mutex;
var withTimeout = require('async-mutex').withTimeout;


app.use(express.json())

const port = 3000
const mutex = new Mutex();


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });}

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/submit',async function(req,res){
    const release = await mutex.acquire();
    try{
    const input = req.body;
    var number = await x.getNumber(input.problem);
    var semester = input.semester;
    var r1 = await x.createFile(number,input.name,(input.source),input.extension);
    var check = await db.userExist(input.discord_id);
    if(!check){
        await db.createUser(input.discord_id,input.name);
    }
    var correctSubmissions = await db.firstCorrect(input.discord_id,number);
    var r = await x.submit(r1);
    var points = await x.getPoints(r,input.problem);
    var diff = await x.getDifficulity(input.problem);
    var y = await db.addSubmission(input.discord_id,number,diff,input.extension,(points>0 | 0),semester);
    var s = await db.getStanding(input.discord_id,semester);
    if(correctSubmissions==0){
        await db.addExperience(input.discord_id,points);
    }
    var k = await db.getExperience(input.discord_id);
    var exp = expToLvl(k);
    r = r.replaceAll("\n  ","\n");
    if(!check) res.send("Congrats on your fist Submit!!\n"+r+"Ranking #"+s.toString()+" "+ProgressMess(k));
    else res.send(r+"Ranking #"+s.toString()+" "+ProgressMess(k));
    }
    finally{
        await sleep(10000);
        release();
    }
})

app.get('/leaderboard',async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    const input = req.query;
    const semester = input.semester;
    var x = await db.getRankings(semester+"\n");
    res.send(x);
})

app.get('/rank', async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    const input = req.query;
    var check = await db.userExist(input.discord_id);
    if(!check){
        await db.createUser(input.discord_id,input.name);
    }
    var k  = await db.getExperience(input.discord_id);
    var s = await db.getStanding(input.discord_id,input.semester);
    res.send("Rank #"+s.toString()+" "+ProgressMess(k));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})