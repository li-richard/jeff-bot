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
  if (event.t !== 'MESSAGE_REACTION_ADD') return;
  if (event.d === null) return;
  if (event.d.message_id !== null) {
    Msgs.findAll({
      where: {
        msg_id: event.d.message_id,
      }
    })
    .then(data => {
      //console.log(data);
      //console.log(event.d.emoji.name);
      data.forEach(msg => {
        const guild = bot.guilds.get(event.d.guild_id);
        const userId = event.d.user_id;
        let roleId = '';
        guild.roles.keyArray().forEach(key => {
          if (guild.roles.get(key).name === msg.dataValues.role) {
            roleId = key;
          }
        });
        if (msg.dataValues.msg_id === event.d.message_id && 
            msg.dataValues.reaction === event.d.emoji.name) {
          guild.fetchMember(userId).then(member => member.addRole(roleId));
        }
      });
    });
  }
})


/*
 *  Bot token - THIS SHOULD BE A PRIVATE TOKEN
 */
bot.login(token); // makes sure to remove after pushing.