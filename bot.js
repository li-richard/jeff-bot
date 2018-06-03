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
  reaction: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.STRING,
  }
});

const bot = new Commando.Client({
  commandPrefix: prefix,
  owner: owner,
  disableEveryone: false
});

bot.once('ready', () => {
  Msgs.sync({force: true});
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
  if (event.t !== 'MESSAGE_REACTION_ADD' && event.t !== 'MESSAGE_REACTION_REMOVE') return;
  if (event.d === null || event.d.message_id === null) return;
  Msgs.findAll({
    where: {
      msg_id: event.d.message_id,
    }
  })
  .then(data => {
    //console.log(data);
    //console.log(event.d.emoji.name);
    data.forEach(msg => {
      console.log(msg);
      const guild = bot.guilds.get(event.d.guild_id);
      const userId = event.d.user_id;
      if (msg.dataValues.msg_id === event.d.message_id && msg.dataValues.reaction === event.d.emoji.name) {
        if (event.t === 'MESSAGE_REACTION_REMOVE') {
          guild.fetchMember(userId).then(member => member.removeRole(guild.roles.find('name', msg.dataValues.role)));
        }
        else {
          guild.fetchMember(userId).then(member => member.addRole(guild.roles.find('name', msg.dataValues.role)));
        }
      }
    });
  });
})


/*
 *  Bot token - THIS SHOULD BE A PRIVATE TOKEN
 */
bot.login(token); // makes sure to remove after pushing.