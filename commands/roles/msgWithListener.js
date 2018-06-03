const Commando = require('discord.js-commando');
const Sequelize = require('sequelize');

class roleReaction extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'msg-with-listener',
      group: 'roles',
      memberName: 'msg-with-listener',
      description: 'Creates a message that allows you to set listeners for certain reactions',
      args: [{
        key: 'content',
        prompt: 'no message entered',
        type: 'string'
      }]
    });
  }

  async run(message, { content }) {
    await message.say(content);

    const sequelize = new Sequelize('database', 'user', 'password', {
      host: 'localhost',
      dialect: 'sqlite',
      logging: false,
      operatorsAliases: false,
      // SQLite only
      storage: 'database.sqlite',
    });

    sequelize
      .authenticate()
      .then(function(err) {
        console.log('Connection has been established successfully.');
      }, function (err) {
        console.log('Unable to connect to the database:', err);
      });
    
    const Msgs = sequelize.define('msgs', {
      msg_id: {
        type: Sequelize.STRING,
      },
    });

    Msgs.sync({}).then(() => {
      Msgs.create({
        msg_id: this.client.user.lastMessageID,
      });
    });

    
    /*
    message.say(content).then(() => {
      const messageId = this.client.user.lastMessageID;
      console.log(this.client.user.lastMessageID);
      this.client.on('raw', event => {
        if (event.d === null) return;
        if (event.d.message_id === messageId) {
          console.log("hello");
          message.guild.fetchMember(message.author).then(member => member.addRole('452637569017184256'));
        }
      });
    }); 
    */
    
  }
  
}

module.exports = roleReaction;
