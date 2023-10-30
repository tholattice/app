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