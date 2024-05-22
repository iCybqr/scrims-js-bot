import { Events, EmbedBuilder } from "discord.js"
import { BotListener, Config } from "lib"

const BOOST_CHANNEL = Config.declareType("Server Boost Channel")

BotListener(Events.GuildMemberUpdate, async (bot, oldMember, newMember) => {
    const oldBoost = oldMember.premiumSinceTimestamp || 0
    const newBoost = newMember.premiumSinceTimestamp || 0
    if (oldBoost >= newBoost) return

    const boostChannelId = bot.getConfigValue(BOOST_CHANNEL, newMember.guild.id)
    if (!boostChannelId) return

    const boostChannel = await newMember.guild.channels.fetch(boostChannelId)
    if (!boostChannel || !boostChannel.isTextBased()) return

    const boostMessage = await boostChannel.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(`${newMember.user.username} has boosted the server!`)
                .setDescription(`Thank you for boosting the server ${newMember}`)
                .setThumbnail(newMember.user.displayAvatarURL()),
        ],
    })
    await boostMessage.react("🎉")
})
