const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const express = require('express');

// إنشاء الـ Client مع تعيين الـ Intents اللازمة
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);

  // Set presence
  client.user.setPresence({
    activities: [
      {
        name: "You Break The Laws",
        type: "WATCHING",
        url: "https://twitch.tv/evo_bots",
      },
    ],
    status: "idle",
  });

  console.log('Presence set successfully');
});


client.on('messageCreate', async message => {
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة القوانين')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#4959a0')
        .setThumbnail('https://cdn.discordapp.com/attachments/1212136370496344074/1249450814586622053/NxA8XXt.png?ex=6667593f&is=666607bf&hm=e62191734a730fe1ec633f34cd5d31c96ceef1e4df8fd03dfc21f9ee0e643de6&')
        .setTitle('قوانين السيرفر')
        .setDescription(`**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت
            سيتم معاقبة من يخالف القوانين على حسب القانون الخالف.**`)
        .setImage('https://share.creavite.co/66660713db2d31826fb8f0e0.gif')
        .setFooter({ text: 'Rules Bot' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'Rules Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

// إنشاء تطبيق Express وتشغيله
const app = express();
app.get('/', (req, res) => {
  res.send('Hello Express app!');
});
app.listen(3000, () => {
  console.log('server started');
});
app.post("/uptime_devtools", (req, res) => {
  console.log("uptime is run by Developer tools");
  res.send({
    msg: "done uptime",
    access: "by_devtools",
  });
});

startServer();
client.login(process.env.TOKEN);
