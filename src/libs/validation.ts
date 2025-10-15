export const isTimeFormatValid = (timeString: string): boolean => {
	const hhmmssRegex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

	return hhmmssRegex.test(timeString);
};


export const toISOTime = (timeString: string) => {
  return new Date(`1970-01-01T${timeString}Z`);
};

export const toUTCDate = (timeString: string) => {
  // interpret time as GMT+7, convert to UTC
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date(Date.UTC(1970, 0, 1, hours! - 7, minutes, seconds));
  return date;
};