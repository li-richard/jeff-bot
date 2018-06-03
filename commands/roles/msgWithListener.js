const Commando = require('discord.js-commando');
const Sequelize = require('sequelize');

class MessageWithListener extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'msg-with-listener',
      group: 'roles',
      memberName: 'msg-with-listener',
      description: 'Creates a message that allows you to set listeners for certain reactions',
      argsType: 'multiple',
      argsSingleQuotes: true,
      args: [
        {
          key: 'msg',
          prompt: 'Enter a message to listen for reactions on',
          type: 'string'
        },
        {
          key: 'reactions',
          prompt: 'Enter reaction(s) to listen for, then the roles that each correspond to, each on a different line. \n<reaction>\n<reaction>\n<role>\n<role>',
          type: 'string',
          infinite: true,
        }
      ]
    });
  }

  async run(message, { msg, reactions }) {
    message.delete();
    await message.say(msg);

    const reactToRole = {};
    for (let i = 0; i < reactions.length / 2; i++) {
      reactToRole[reactions[i]] = reactions[i + reactions.length / 2];
      message.channel.fetchMessage(this.client.user.lastMessageID).then(message => message.react(reactions[i]));
    }

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
      .then(() => {
        console.log('Connection has been established successfully.');
      }, (err) => {
        console.log('Unable to connect to the database:', err);
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

    Msgs.sync({force: true}).then(() => {
      console.log(this.client.user.lastMessageID);
      Object.keys(reactToRole).forEach(react => {
        Msgs.create({
          msg_id: this.client.user.lastMessageID,
          reaction: react,
          role: reactToRole[react],
        })
      })
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

module.exports = MessageWithListener;
