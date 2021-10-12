const express = require('express')
const app = express()
const utf8 = require('utf8')
const x = require('./submit.js')
const db = require('./db.js')

app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World!');
})


app.post('/submit',(req,res)=>{
    const input = req.body;
    x.getNumber(input.problem).then(number=>{
        x.createFile(number,input.name,(input.source),input.extension).then((r1)=>
        {
            console.log(input.name)
            db.userExist(input.discord_id).then(check=>{
                if(check){
                    x.submit(r1).then(r =>{
                        db.addSubmission(input.discord_id,number).then((y)=>{
                            db.getStanding(input.discord_id).then(s=>{
                                //console.log(s);
                                res.send(r+"\nYOUR RANK IS: "+s.toString());
                            })
                        })
                    });
                }
                else{
                    db.createUser(input.discord_id,input.name).then(()=>{
                        x.submit(r1).then(r =>{
                            db.addSubmission(input.discord_id,number).then((y)=>{
                                db.getStanding(input.discord_id).then(s=>{
                                    //console.log(s);
                                    res.send(r+"\nYOUR RANK IS: "+s.toString());
                                })
                            })
                        });
                    })
                }
            })

        });

    })

    //res.send(req.body);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})