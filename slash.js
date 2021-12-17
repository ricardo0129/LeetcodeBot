const {Client, Intents, Collection} = require("discord.js");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const fs = require("fs");
const { default: axios } = require("axios");
require('dotenv').config()

const client = new Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const commandFiles = fs.readdirSync("./commands").filter(file=>file.endsWith(".js"));

const commands = [];

client.commands = new Collection();
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name,command);
}

client.once("ready",()=>{
    console.log("beep boop");
    const CLIENT_ID = client.user.id;

    const rest = new REST({
        version: "9",
    }).setToken(process.env.BOT_KEY);
    (async ()=>{
        try{
            if(process.env.ENV === "production"){
                await rest.put(Routes.applicationCommands(CLIENT_ID),{
                    body: commands
                });
                console.log("global commands set")
            }
            else{
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID,process.env.GUILD_ID), {
                    body: commands
                })
                console.log("locally commands set")

            }
        }catch(err){
            if(err) console.log(err);
        }
    })();
});

client.on('interactionCreate',async interaction=>{
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    try{
        const author =  interaction.user.id;
        const name = interaction.user.name;
        axios.get('http://localhost:3000/rank',
        {
            params: {
            discord_id: author,
            name: name,
            semester: 1
            }
        }).then(res=>{
            command.execute(interaction,res.data);
        })
    }
    catch(err){
        if(err) console.error(err);

        await interaction.reply({
            content: "Error has occurred",
            ephemeral: true
        })
    }
});

client.on('messageCreate',async message=>{
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
})

client.login(process.env.BOT_KEY);