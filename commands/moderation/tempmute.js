const {MessageEmbed} = require("discord.js")
const db = require("quick.db")

const sleep = t => new Promise(r => setTimeout(r, t))

function timee(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " godzine" : " godzin") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minut") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sekunde" : " sekund") : "";
    return hDisplay + mDisplay + sDisplay;
}

module.exports = {
    name: "tempmute",
    run: async(client,message,args,pr,errorNull,errorPermissions,a,errorBotPermissions) => {
        const member = message.mentions.members.first()
        const obj = {
            muted: {
                time: {
                    date: undefined,
                    sec: undefined
                },
                check: undefined
            }
        }
        const time = {
            "s": 1,
            "sec": 1,
            "second": 1,
            "m": 60,
            "min": 60,
            "minute": 60,
            "h": 3600,
            "hr": 3600,
            "hour": 3600
        }

        if (!message.member.hasPermission("MUTE_MEMBERS"))
            return message.reply(errorPermissions("WYCISZANIE UŻYTKOWNIKÓW", "MUTE_MEMBERS"))
                .catch(err => console.log(err))

        if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
            return message.reply(errorBotPermissions("ZARZĄDZANIE KANAŁAMI", "MANAGE_CHANNELS"))
                .catch(err => console.log(err))

        const roleId = db.get(`${message.guild.id}_muted`) || {id: undefined}
        const role = message.guild.roles.cache.get(roleId.id)

        if(!role) {
            const embed = new MessageEmbed()
                .setTitle("Rola nie istnieje!")
                .setDescription("Aby stworzyć role użyj komendy `muted create` lub `muted set-role`")
                .setColor("RED")

            return message.reply(embed)
                .catch(err => console.log(err))
        }

        if(role.position >= message.guild.me.roles.cache.first().size) {
            const embed = new MessageEmbed()
                .setTitle("Rola nie można nadać!")
                .setDescription("Role którą chcesz wyciszyć jest na tej samej pozycji co moja lub większa")
                .setColor("RED")

            return message.reply(embed)
                .catch(err => console.log(err))
        }

        if(!member)
            return message.reply(errorNull("tempmute", "<member>"))
                .catch(err => console.log(err))

        const mutedMember = { muted } = db.get(`${member.guild.id}_${member.id}_mute`) || obj

        if(mutedMember.check) {
            const embed = new MessageEmbed()
                .setTitle("Użytkownik jest już wyciszony!")
                .setDescription("Odcisz użytkownika aby nadać znowu wyciszenie")
                .setColor("RED")

            return message.reply(embed)
                .catch(err => console.log(err))
        }

        if(member.roles.cache.first().position >= message.member.roles.cache.first().position) {
            const embed = new MessageEmbed()
                .setTitle("Nie posiadasz permisji!")
                .setDescription("Twoja rola jest zbyt nisko do użytkowna którego chcesz wyciszyć")
                .setColor("RED")

            return message.reply(embed)
                .catch(err => console.log(err))
        }

        if(member.hasPermission("ADMINISTRATOR")) {
            const embed = new MessageEmbed()
                .setTitle("Nie posiadasz permisji!")
                .setDescription("Użytkownik posiada permisje ADMINISTRATOR(ADMINISTRATOR)")
                .setColor("RED")

            return message.reply(embed)
                .catch(err => console.log(err))
        }

        const timedText = (args[1] || " ").toLowerCase() || " "
        const number = Math.floor(timedText.replace(/(^\d+)(.+$)/i, '$1'))
        const timeType = timedText.replace(/[^a-zA-Z]+/g, '') || NaN
        const timeParsed = number * time[timeType]

        if (!number || !time[timeType] || !timeType || !timeParsed)
            return message.reply(errorNull("tempmute", "<member> <time+timeType(second/minute/hour)>"))
                .catch(err => console.log(err))

        member.roles.add(role)
            .catch(err => console.log(err))

        db.set(`${member.guild.id}_${member.id}_mute`,{
            muted: {
                time: {
                    date: new Date().getTime(),
                    sec: timeParsed
                },
                check: true
            }
        })

        const embed = new MessageEmbed()
            .setColor("DARK_PURPLE")
            .setTitle("Gotowe!")
            .setDescription("Użytkownik został wyciszony")
            .addFields(
                {
                    name: "Powód",
                    value: args.slice(2).join(" ") || "Brak"
                },
                {
                  name: "Czas",
                  value: timee(timeParsed)
                },
                {
                    name: "Użytkownik",
                    value: member
                }
            )

        const msg = await message.reply(embed)
            .catch(err => console.log(err))

        db.push(`${member.guild.id}_${member.id}_punish`,{
            id: message.id,
            name: "tempmute",
            reason: args.slice(1).join(" ")  || "Brak",
            author: message.author.tag
        })

        await sleep(timeParsed * 1000)

        member.roles.remove(role)
            .catch(err => console.log(err))

        db.push(`${member.guild.id}_${member.id}_punish`,{
            id: msg.id,
            name: "auto unmute",
            reason: args.slice(1).join(" ")  || "Brak",
            author: client.user.tag
        })
    }
}