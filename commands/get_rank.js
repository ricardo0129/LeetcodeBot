const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Get rank for Leetcode Solutions"),
    async execute(interaction,message){
        console.log('giving ranking');
        interaction.reply({
            content: message,
            ephemeral: true 
        });
    }
}