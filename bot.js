// Require the necessary discord.js classes
const axios = require('axios');
const { Client, Intents } = require('discord.js');
//const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    client.channels.cache.get('920356150006919248').send('pong');
});


client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.channel.name != "bot") return;
    const author = message.author.id;
    //const author = 314;
    const username = message.author.username;
    const code = message.content;
    const problem = /[\w|\W|\s]*[cpp|java|py3|js|kt][\s]*[|][|][\w|\W|\s]*[|][|]/g;
    var all = new RegExp(problem);
    var k = code.search(all);
    if(k==-1) return;
    var firstline = code.split('\n')[0];
    firstline = firstline.split(" ");
    const extension = firstline.pop();
    var name = firstline.join(" ");
    var source = code.split('\n');
    source = source.slice(1);
    source = source.join('\n');
    var i = source.indexOf("\|\|");
    var j = source.lastIndexOf("\|\|");
    if(i!=-1 && j!=-1 && i!=j)
    source = source.substring(i+2,j-i);
    source = source.replaceAll("| |","||");

    axios.post('http://localhost:3000/submit',
        {
            "name":username, "source":source,"extension":extension,"problem":name,"discord_id":author,"semester":1
        }
    ).then((res)=>{
        res.data = res.data.replaceAll("✔","✅");
        console.log(res.data);
        message.reply(res.data);
    });
});

// Login to Discord with your client's token
key = process.env.botKey;
client.login(key);