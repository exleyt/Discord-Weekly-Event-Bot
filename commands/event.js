const { SlashCommandBuilder } = require('@discordjs/builders');
const daysOfWeek = 'smtwhfa';
const indicators = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'zero', 'yellow_circle', 'x'];
const indicatorUnicodes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣', '🟡', '❌'];
const secondsInDay = 86400;

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
		const startDayOfWeek = startDate.getDay();
		const days = interaction.options.getString('days');
		// Converts days of week to an array of values ranging daysOfWeek.length from startDayOfWeek
		const dayValues = Array.from(days)
			.filter((element, index, array) => array.indexOf(element) === index)
			// eslint-disable-next-line
			.map(element => ((index = daysOfWeek.indexOf(element)) < startDayOfWeek) ? index + daysOfWeek.length : index)
			.sort((a, b) => a - b);
		const size = interaction.options.getInteger('size');
		const length = interaction.options.getInteger('length');
		// Converts minute timeslots to seconds
		const deltaTime = length * 60;

		// Validates arguments
		try {
			if (!mentionable) { throw 'Invalid mentionable! Use a defined tag only.'; }
			else if (!name) { throw 'Invalid name! Use a nonempty string only.'; }
			else if (dayValues.some(element => element == -1)) { throw 'Invalid days! Use \'smtwhfa\' only.'; }
			else if (!startEpoch) { throw 'Invalid date! Use \'yyyy-mm-ddThh:mm\' only.'; }
			else if (size < 1 || size > indicators.length) { throw 'Invalid size! Use 1-10 only.'; }
			else if (length < 1 || length > 10080) { throw 'Invalid length! Use 1-10080 only.'; }
		}
		catch (error) {
			await interaction.reply({ content: error, ephemeral: true });
			return;
		}

		// Deletes reply to send channel message instead
		interaction.deferReply();
		interaction.deleteReply();

		for (const dayValue of dayValues) {
			// Epoch time of current day in loop
			const epoch = (dayValue - startDayOfWeek) * secondsInDay + startEpoch;

			let message = `${mentionable} This is the signup sheet for ${name} <t:${epoch}:D> which starts <t:${epoch}:R>. Please react accordingly.\n`;
			// Builds message contents
			for (let slot = 0; slot < size; slot++) {
				// Time slot bounds for this loop
				const firstTime = epoch + deltaTime * slot;
				const secondTime = firstTime + deltaTime;
				message += `\n:${indicators[slot]}: = <t:${firstTime}:t> - <t:${secondTime}:t>`;
			}
			message += `\n:${indicators[indicators.length - 2]}: = unsure yet` +
				`\n:${indicators[indicators.length - 1]}: = no time today`;
			const post = await interaction.channel.send(message);
			// Reacts to message contents with all used indicators
			for (let slot = 0; slot < size; slot++) {
				await post.react(`${indicatorUnicodes[slot]}`);
			}
			await post.react(`${indicatorUnicodes[indicatorUnicodes.length - 2]}`);
			await post.react(`${indicatorUnicodes[indicatorUnicodes.length - 1]}`);
		}
	},
};