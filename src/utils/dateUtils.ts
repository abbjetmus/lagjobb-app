import { date } from 'quasar';
const options = {
  days: [
    'Söndag',
    'Måndag',
    'Tisdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lördag' /* and all the rest of days - remember starting with Sunday */,
  ],
  daysShort: [
    'Sön',
    'Mån',
    'Tis',
    'Ons',
    'Tor',
    'Fre',
    'Lör' /* and all the rest of days - remember starting with Sunday */,
  ],
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'Semptember',
    'Oktober',
    'November',
    'December' /* and all the rest of months */,
  ],
  monthsShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Maj',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dec' /* and all the rest of months */,
  ],
};

const locale = {
  ...options,
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
}

const formatMonth = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'MMMM', options);
    return datum;
  } else {
    return '';
  }
};

const formatDate = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'dddd, D MMM', options);
    return datum;
  } else {
    return '';
  }
};

const formatDate2 = (value: Date) => {
  if (value) {
    const tid = date.formatDate(value, 'YYYY-MM-DD');
    return tid;
  } else {
    return '';
  }
};

const formatDateYYYYMMDD2 = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'YYYY-MM-DD', options);
    return datum;
  } else {
    return '';
  }
};

const formatDateYYYYMMDD = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'YYYY/MM/DD', options);
    return datum;
  } else {
    return '';
  }
};

const formatDate3 = (value: Date) => {
  if (value) {
    const tid = date.formatDate(value, 'YYYY/MM/DD');
    return tid;
  } else {
    return '';
  }
};

const formatTime = (value: Date) => {
  if (value) {
    const tid = date.formatDate(value, 'HH:mm');
    return tid;
  } else {
    return '';
  }
};

const formatDateTime = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'HH:mm, dddd D MMM', options);
    return datum;
  } else {
    return '';
  }
};

const formatDateTime2 = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'YYYY-MM-DD HH:mm', options);
    return datum;
  } else {
    return '';
  }
};

const formatDayAndMonth = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'ddd D MMM', options);
    return datum;
  } else {
    return '';
  }
};

const typeColor = (value: string) => {
  if (value != null) {
    return value.slice(3);
  } else {
    return 'grey';
  }
};

const byteToMegabyte = (bytes: number) => {
  if (bytes != null) {
    return (bytes / (1024 * 1024)).toFixed(1);
  } else {
    return '';
  }
};

function isEmpty(obj: object) {
  return Object.keys(obj).length === 0;
}
// Onsdag 5 Juli 2023 kl. 01:00
function extractCalendarDate(value: string) {
  const d = date.extractDate(value, 'dddd D MMMM YYYY[ Kl. ]HH:mm', options);
  return d;
}

const formatDateCalendar = (value: Date) => {
  if (value) {
    const datum = date.formatDate(value, 'dddd, D', options)
    return datum
  } else {
    return ''
  }
}

function capitalizeWords(str: string) {
  // Split the string into an array of words
  const words = str.split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back together into a string
  const capitalizedStr = capitalizedWords.join(' ');

  return capitalizedStr;
}

export {
  formatMonth,
  formatDate,
  formatDate2,
  formatTime,
  formatDateTime,
  typeColor,
  byteToMegabyte,
  formatDate3,
  formatDayAndMonth,
  isEmpty,
  formatDateYYYYMMDD2,
  formatDateYYYYMMDD,
  extractCalendarDate,
  capitalizeWords,
  formatDateCalendar,
  formatDateTime2,
  options,
  locale
};
