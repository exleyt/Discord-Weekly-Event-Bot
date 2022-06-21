const { SlashCommandBuilder } = require('@discordjs/builders');
const daysOfWeek = 'smtwhfa';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('event')
		.setDescription('helps schedule a weekly event')
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

		// Validates arguments
		try {
			if (!mentionable) { throw 'Invalid mentionable! Use a defined tag only.'; }
			else if (!name) { throw 'Invalid name! Use a nonempty string only.'; }
			else if (dayValues.some(element => element == -1)) { throw 'Invalid days! Use \'smtwhfa\' only.'; }
			else if (!startEpoch) { throw 'Invalid date! Use \'yyyy-mm-ddThh:mm\' only.'; }
			else if (size < 1 || size > indicators.length) { throw 'Invalid size! Use 1-10 only.'; }
			else if (length < 0 || length > 10080) { throw 'Invalid length! Use 1-10080 only.'; }
		}
		catch (error) {
			await interaction.reply({ content: error, ephemeral: true });
			return;
		}

		await interaction.reply(`${mentionable} This is the signup sheet for ${name} <t:${startEpoch}:D> which starts <t:${startEpoch}:R>. Please react accordingly.`);
		await interaction.followUp('Pingu!');
	},
};