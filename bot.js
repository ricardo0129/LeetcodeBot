// Require the necessary discord.js classes
const axios = require('axios');
const { Client, Intents } = require('discord.js');
//const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    //client.channels.cache.get('887119881038856206').send('pong');
});

client.on('interactionCreate', async interaction => {
    console.log("asd");
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'beep') {
		await interaction.reply('Boop!');
	}
});

client.on('messageCreate', async message => {
    if(message.author.bot) return;
    const author = message.author.id;
    const username = message.author.username;
    const code = message.content;
    var firstline = code.split('\n')[0];
    firstline = firstline.split(" ");
    const extension = firstline.pop();
    var name = firstline.join(" ");
    // name = name.toLowerCase()
    // .split(' ')
    // .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    // .join(' '); 

    console.log(name+" "+extension);
    var source = code.split('\n');
    source = source.slice(1);
    source = source.join('\n');
    var i = source.indexOf("\|\|");
    var j = source.lastIndexOf("\|\|");
    console.log(i,j);
    if(i!=-1 && j!=-1 && i!=j)
    source = source.substring(i+2,j-i);
    console.log(source);

    axios.post('http://localhost:3000/testing',
        {
            "name":username, "source":source,"extension":extension,"problem":name,"discord_id":author
        }
    ).then((res)=>{
        console.log(res.data);
        message.reply(res.data);
    });
});

// Login to Discord with your client's token
key = 'testkey'
client.login(key);
