const { SlashCommandBuilder } = require('@discordjs/builders');
const daysOfWeek = 'smtwhfa';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!')
		.addMentionableOption(option =>
			option.setName('mentionable')
				.setDescription('mention something')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('name')
				.setDescription('the name of the event to post for')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('start_day')
				.setDescription('what day of the year to start on \'yyyy-mm-dd\' local')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('start_time')
				.setDescription('what time of the day to start at \'hh:mm\' local')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('days')
				.setDescription(`which days of the week to repeat for '${daysOfWeek}'`)
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('size')
				.setDescription('the number of time slots for each day 1-10')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('length')
				.setDescription('the number of minutes for each time slot')
				.setRequired(true)),
	async execute(interaction) {
		const mentionable = interaction.options.getMentionable('mentionable');
		const name = interaction.options.getString('name');
		const startDay = interaction.options.getString('start_day');
		const startTime = interaction.options.getString('start_time');
		// Converts a start day and time to a Date object
		const startDate = new Date(`${startDay}T${startTime}`);
		// Converts a Date object to a local Epoch time in seconds
		const startEpoch = startDate.getTime() / 1000;
		const days = interaction.options.getString('days');
		// Converts days of week to an array of values from 0-6
		const dayValues = Array.from(days)
			.filter((element, index, array) => array.indexOf(element) === index)
			.map(element => daysOfWeek.indexOf(element));
		const size = interaction.options.getInteger('size');
		const length = interaction.options.getInteger('length');
		await interaction.reply(`${mentionable} This is the signup sheet for ${name} <t:${startEpoch}:D> which starts <t:${startEpoch}:R>. Please react accordingly.`);
		await interaction.followUp('Pingu!');
	},
};