export const getCurrentTime = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const parseTime = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  try {
    const diff = parseTime(endTime) - parseTime(startTime);
    if (diff < 0) return 'Invalid';
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}h ${mins}m`;
  } catch {
    return null;
  }
};

export const formatIsoDateForDisplay = (isoDate, locale = 'en-US') =>
  new Date(isoDate).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });

export const formatIsoDateLong = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });




