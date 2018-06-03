const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const Sequelize = require('sequelize');

const { prefix, token, owner } = require('./config.json');

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
  // SQLite only
  storage: 'database.sqlite',
});

const Msgs = sequelize.define('msgs', {
  msg_id: {
    type: Sequelize.STRING,
  },
});

const bot = new Commando.Client({
  commandPrefix: prefix,
  owner: owner,
  disableEveryone: false
});

bot.once('ready', () => {
  Msgs.sync();
})

bot.registry.registerGroups([
    ['random', 'Random number generators'],
    ['roles', 'Role commands']
  ])
  .registerDefaults()
  //.registerDefaultCommands()
  .registerCommandsIn(__dirname + "/commands");

bot.on('ready', () => {
  console.log('jeff bot is now ready to slave away.');
  bot.user.setActivity('upgrading some new stuff!');
});

bot.on('raw', event => {
  if (event.d === null) return;
  if (event.d.message_id !== null) {
    Msgs.findAll({
      where: {
        msg_id: event.d.message_id,
      }
    })
    .then(msg_ids => {
      console.log(event.d.guild_id);
      if (msg_ids.length > 0) {
        bot.guilds.get(event.d.guild_id).fetchMember(event.d.user_id).then(member => member.addRole('452637569017184256'));
      }
    });
  }
})
//448146015594479616


/*
 *  Bot token - THIS SHOULD BE A PRIVATE TOKEN
 */
bot.login(token); // makes sure to remove after pushing.