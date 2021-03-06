const db = require("quick.db")

module.exports = {
    name: "guildMemberRemove",
    async execute(member,ctx) {
        const switched = db.get(`${member.guild.id}_switch_leave`)

        if (switched != 1)
            return;

        const joined = db.get(`${member.guild.id}_leave`)
        const text = ctx.tags(joined.text, member)

        member.guild.channels.cache.get(joined.id).send(text)
            .catch(err => console.log(err))
    }
}