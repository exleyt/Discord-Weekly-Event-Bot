// Require the necessary node.js classes
const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Require the necessary authentification tokens
const { clientId, token } = require('./auth.json');

const commands = [];

// Defines path to command files
const commandsPath = path.join(__dirname, 'commands');

// Filters files from commandPath for the .js extension
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Populates commands for each of the commandFiles
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Push a new item to the commands list
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

// https://stackoverflow.com/questions/69171432/how-to-delete-slash-commands-in-discord-js-v13
// Deletes all existing application commands
rest.get(Routes.applicationCommands(clientId))
	.then(data => {
		const promises = [];
		for (const command of data) {
			const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
			promises.push(rest.delete(deleteUrl));
		}
		return Promise.all(promises);
	});

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);