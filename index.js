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
        .setThumbnail('https://cdn.discordapp.com/attachments/1212136370496344074/1242195193281642588/LU2NO52.png?ex=664cf3ec&is=664ba26c&hm=341f273f30918f896ce5762b1f538508aeccb3ba936944156f0d17316eff42d6&')
        .setTitle('قوانين السيرفر')
        .setDescription(`**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت
            سيتم معاقبة من يخالف القوانين على حسب القانون الخالف.**`)
        .setImage('https://cdn.discordapp.com/attachments/1212136370496344074/1242197574794874961/01foYxE.png?ex=664cf624&is=664ba4a4&hm=e41a0c7ca464223054f47f43438c50070cb5f18e13799e05d1d7a0bcbb169243&')
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
