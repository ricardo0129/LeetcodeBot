const express = require('express')
const app = express()
const utf8 = require('utf8')
const x = require('./submit.js')
const db = require('./db.js')
const { expToLvl, progressBar, ProgressMess } = require('./math.js')

app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!');
})

app.post('/submit',async function(req,res){
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
    if(!check) res.send("Congrats on your fist Submit!!\n"+r+"Your rank is "+s.toString()+" Level "+exp[0]+" Exp to next Lvl "+exp[1]);
    else res.send(r+"Ranking #"+s.toString()+" "+ProgressMess(k));
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
    console.log(input);
    console.log(input.discord_id+input.semester);
    var k  = await db.getExperience(input.discord_id);
    var s = await db.getStanding(input.discord_id,input.semester);
    res.send("Rank #"+s.toString()+" "+ProgressMess(k));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})