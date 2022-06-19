const { SlashCommandBuilder } = require('@discordjs/builders');

// new Date(2010, 6, 26).getTime() / 1000
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('the name of the event to post for')
				.setRequired(true))
		.addMentionableOption(option =>
			option.setName('mentionable')
				.setDescription('mention something')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('days')
				.setDescription('which days of the week to repeat for \'mtwhfsu\'')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('start_day')
				.setDescription('what day of the year to start on \'yyyy-mm-dd\' local')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('size')
				.setDescription('the number of time slots for each day')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('length')
				.setDescription('the number of minutes for each time slot')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('start_time')
				.setDescription('what time of the day to start at \'hh:mm\' local')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};