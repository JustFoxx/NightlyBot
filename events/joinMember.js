const db = require("quick.db")

module.exports = {
    name: "guildMemberAdd",
    async execute(member,ctx) {
        const switched = db.get(`${member.guild.id}_switch_join`)

        if (switched != 1)
            return;

        const joined = db.get(`${member.guild.id}_join`)
        const text = ctx.tags(joined.text, member)

        member.guild.channels.cache.get(joined.id).send(text)
            .catch(err => console.log(err))
    }
}