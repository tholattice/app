export function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDollar(num: number) {
  const withDecimals = num / 100;

  return (
    "$" +
    parseFloat(Intl.NumberFormat("en-US").format(withDecimals)).toFixed(2)
  );
  }
  
export function humanize(str:String) {
  var i, frags = str.split('_');

  for (i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }

  return frags.join(' ');
}
  
export function nFormatter(
  num?: number,
  opts: { digits?: number; full?: boolean } = {
    digits: 1,
  },
  ) {
    if (!num) return "0";

    if (opts.full) {
      return Intl.NumberFormat("en-US").format(num);
    }

    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

    var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });

    return item
    ? (num / item.value).toFixed(opts.digits).replace(rx, "$1") + item.symbol
    : "0";
  }
  
export function nativeDateObjectified(date:Date|number|null) {
  let dateObject;
  
  if (typeof(date) === 'number') {
    dateObject = unixDateToNative(date);
  } else if (date instanceof Date) {
    dateObject = date;
  } else {
    return null
  }
    
  const newParsedDateObject = {
    year: dateObject.getFullYear(),
    month: dateObject.toLocaleString('default', { month:'short' }),
    day: dateObject.getDay()
  }
  
  return newParsedDateObject
}

export function unixDateToNative(date: number) {
  const fullDate = new Date(date * 1000)

  return fullDate
}

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function extractDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatPhoneNumber(phoneNumberString: string, int: boolean) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');

  if (int) {
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    var intlCode = (match[1] ? '+1 ' : '');
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }} else {
    var match = cleaned.match(/(\d{3})(\d{3})(\d{4})$/);

    if (match) {
      return ['(', match[1], ') ', match[2], '-', match[3]].join('');
    }
  }
  
  return null;
}