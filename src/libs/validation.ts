export const isTimeFormatValid = (timeString: string): boolean => {
	const hhmmssRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

	return hhmmssRegex.test(timeString);
};
