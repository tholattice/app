export function formatDollar(num: number) {
    const withDecimals = num / 100;

    return (
      "$" +
      parseFloat(Intl.NumberFormat("en-US").format(withDecimals)).toFixed(2)
    );
  }

export function unixDateToNative(date: number) {
  const fullDate = new Date(date * 1000)

  return fullDate
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

export function humanize(str:String) {
  var i, frags = str.split('_');
  for (i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

export function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}