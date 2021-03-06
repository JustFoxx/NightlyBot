const {MessageEmbed} = require("discord.js")

module.exports = {
    name: "tags",
    description: "Tagi które używa się w takich komendach jak joinmsg lub leavemsg",
    use: "tags",
    run: async(ctx) => {
        function styled(string) {
            return "```\n" + string.split(" ").join("\n") + "```"
        }

        const embed = new MessageEmbed()
            .setTitle("Lista CMD tagów")
            .setColor("DARK_PURPLE")
            .addFields(
                {
                    name: "Guild",
                    value: styled("#guild.name# #guild.members# #guild.icon# #guild.createdAt#"),
                    inline: true
                },
                {
                    name: "Member",
                    value: styled("#member.name# #member.mention# #member.tag# #member.id# #member.name# #member.joinedAt# #member.createdAt# #member.avatar#"),
                    inline: true
                }
            )

        ctx.message.reply(embed)
            .catch(err => console.log(err))
    }
}