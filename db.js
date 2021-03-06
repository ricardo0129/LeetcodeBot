const {Pool, Client} = require('pg')

const pool = new Pool({
user: "admin",
host: "localhost",
database: "api",
password: "password",
port: "5432"
})
module.exports = {
    userExist: async function (discord_id){
        return pool.query('SELECT EXISTS(SELECT 1 FROM users WHERE discord_id='+discord_id+")")
        .then(res =>{
            //console.log(res.rows[0]);
            return (res.rows[0]['exists']);
        })
        .catch(e => console.error(e.stack))
    },

    createUser: async function (discord_id, userName){
        var queryString = "INSERT INTO Users (discord_id, username) VALUES (" + "'" + [discord_id, userName].join("','") + "'" + ") RETURNING *";
        return pool.query(queryString)
        .then(res=>console.log(res.rows))
        .catch(e=>console.error(e.stack));
    },

    addExperience: async function (discord_id,experience){
        console.log("adding here:"+discord_id,experience);
        var queryString = "UPDATE users SET experience = experience + "+experience+" WHERE discord_id = "+discord_id+" RETURNING experience;"
        return pool.query(queryString)
        .then(res=>{
            return res.rows[0]['experience'];
        })
        .catch(e=>console.log(e.stack));
    },

    getExperience: async function(discord_id){
        var queryString = "SELECT experience FROM users WHERE discord_id = "+discord_id+";"
        return pool.query(queryString)
        .then(res=>{
            return res.rows[0]['experience'];
        })
        .catch(e=>console.log(e.stack));
    },

    firstCorrect: async function (discord_id,leetcode_id){
        var queryString = "SELECT COUNT(question) FROM submissions WHERE discordid = "+discord_id+" AND question = "+leetcode_id+" AND verdict = 1;"
        return pool.query(queryString)
        .then(res=>{
            return res.rows[0]['count'];
        })
        .catch(e=>console.log(e.stack));
    },

    addSubmission: async function (discord_id,leetcode_id,difficulty,language,verdict,semester){
        var queryString = "INSERT INTO submissions(discordid,time,question,difficulty,language,verdict,semester) VALUES ("+discord_id+",NOW(),"+leetcode_id+",\'"+difficulty+"\',\'"+language+"\',"+verdict+","+semester+");"
        return pool.query(queryString)
        .then(res=>console.log(res))
        .catch(e=>console.error(e.stack));
    },

    countSubmissions: async function (discord_id,semester){
        var queryString = "SELECT COUNT(id) from submissions where discordid="+discord_id+" and semester = "+semester;
        return pool.query(queryString)
        .then(res=>{
            return res.rows[0]['count'];
        })
        .catch(e=>console.error(e.stack));
    },

    getRankings: async function(semester){
        var queryString = "SELECT *, RANK() OVER(ORDER BY correct DESC) from (SELECT users.*, COUNT(distinct submissions.question) as correct from users left join submissions on(users.discord_id = submissions.discordid) WHERE verdict = 1 and semester = "+semester+" group by users.discord_id) as subb;"
        return pool.query(queryString)
        .then(res=>{
            //console.log(res);
            return res.rows;
        })
        .catch(e=>console.error(e.stack));
    },

    /*
    SELECT *, RANK() OVER(ORDER BY subs DESC) from (SELECT users.*, COUNT(distinct submissions.question) as subs from users left join submissions on(users.discord_id = submissions.discordid) group by users.discord_id) as subb;
    */
    getStanding: async function (discord_id,semester){
        var queryString = "select * from (select *, RANK () OVER ( ORDER by experience DESC) rank from users) as subb where discord_id = "+discord_id+";"
        return pool.query(queryString)
        .then(res=>{
            console.log(res.rows);
            return res.rows[0]['rank'];
        })
        .catch(e=>console.error(e.stack));
    },

    resetExp: async function (discord_id){
        var queryString = "update users set experience = 0;"
        return pool.query(queryString)
        .then(res=>{
            return res;
        })
        .catch(e=>console.error(e.stack));
    }


}
