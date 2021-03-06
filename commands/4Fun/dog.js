const {MessageEmbed} = require("discord.js")
const fetch = require('node-fetch')

module.exports = {
    name: "dog",
    description: "Randomowy obrazek psa",
    use: "dog",
    run: async(ctx) => {
        const image = await fetch("https://dog.ceo/api/breeds/image/random").then(response => response.json())
            .catch(err => console.log(err))
        const embed = new MessageEmbed()
            .setColor("DARK_PURPLE")
            .setImage(image.message)
            .setTitle("Piesek")
            .setURL(image.message)

        ctx.message.reply(embed)
            .catch(err => console.log(err))
    }
}