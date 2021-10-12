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

    addSubmission: async function (discord_id,leetcode_id){
        var queryString = "INSERT INTO submissions(discordid,time,question) VALUES ("+discord_id+",NOW(),"+leetcode_id+");"
        return pool.query(queryString)
        .then(res=>console.log(res))
        .catch(e=>console.error(e.stack));
    },

    countSubmissions: async function (discord_id){
        var queryString = "SELECT COUNT(id) from submissions where discordid="+discord_id;
        return pool.query(queryString)
        .then(res=>{
            return res.rows[0]['count'];
        })
        .catch(e=>console.error(e.stack));
    },

    getRankings: async function (){
        var queryString = "SELECT discord_id, RANK() OVER(ORDER BY subs DESC) from (SELECT users.*, COUNT(submissions.discordid) as subs from users left join submissions on(users.discord_id = submissions.discordid) group by users.discord_id) as subb;"
        return pool.query(queryString)
        .then(res=>{
            return res.rows;
        })
        .catch(e=>console.error(e.stack));
    },

    getStanding: async function (discord_id){
        var queryString = "SELECT * from (select discord_id, RANK() OVER(ORDER BY subs DESC) from (SELECT users.*, COUNT(submissions.discordid) as subs from users left join submissions on(users.discord_id = submissions.discordid) group by users.discord_id) as subb) as temp  where discord_id="+discord_id       
        return pool.query(queryString)
        .then(res=>{
            console.log(res);
            return res.rows[0]['rank'];
        })
        .catch(e=>console.error(e.stack));
    }

}
