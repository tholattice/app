import { Metadata } from 'next';
import { customAlphabet } from 'nanoid'

import { HOME_DOMAIN } from './constants';
import { Time } from '@/lib/types/types';

export const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7,
  ); // 7-character random string

  export function constructMetadata({
    title = "Tholattice Digital Marketing - full-service marketing solution for Asian massage therapists",
    description = "Tholattice is a full-service marketing software solution for Asian massage therapists who want a quality, professional digital presence",
    image = "https://tholattice.com/_static/TholatticeSymbolWhiteBG.png",
    icons = "/icon.ico",
    noIndex = false,
  }: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
  } = {}): Metadata {
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
          },
        ],
      },
      // twitter: {
      //   card: "summary_large_image",
      //   title,
      //   description,
      //   images: [image],
      //   creator: "@dubdotco",
      // },
      icons,
      metadataBase: new URL(HOME_DOMAIN),
      ...(noIndex && {
        robots: {
          index: false,
          follow: false,
        },
      }),
    };
  }

  export const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  export const getDomainWithoutWWW = (url: string) => {
    if (isValidUrl(url)) {
      return new URL(url).hostname.replace(/^www\./, "");
    }
    try {
      if (url.includes(".") && !url.includes(" ")) {
        return new URL(`https://${url}`).hostname.replace(/^www\./, "");
      }
    } catch (e) {
      return null;
    }
  };

// Extract time from a Date object
export function getTimeFromDate(date: Date): Time {
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const seconds: number = date.getSeconds();

  return {
    hours,
    minutes,
    seconds,
  };
}

// Compare two Time objects
export function compareTimes(time1: Time, time2: Time): number {
  if (time1.hours !== time2.hours) {
    return time1.hours - time2.hours;
  }

  if (time1.minutes !== time2.minutes) {
    return time1.minutes - time2.minutes;
  }

  return time1.seconds - time2.seconds;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export const rearrangeArray = (arr: number[], num: number): number[] => {
  const index = arr.indexOf(num); // Find the index of the specified number
  if (index === -1) {
    // If the number is not found in the array, return the original array
    return arr;
  }

  // Split the array into two parts at the specified index
  const firstPart = arr.slice(index + 1);
  const secondPart = arr.slice(0, index);

  // Concatenate the two parts in reverse order with the specified number moved to the front
  const result = [...firstPart, ...secondPart, num];

  return result;
};

export const isToday = (date: Date) => {
  const today = new Date(); // Create a new Date object representing today
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Function to compare times of two Date objects
export function compareDateTimes(date1: Date, date2: Date): number {
  const time1 = getTimeFromDate(date1); // Extract time from date1
  const time2 = getTimeFromDate(date2); // Extract time from date2
  return compareTimes(time1, time2); // Compare the extracted times
}

export function setToNext30MinuteInterval(date: Date): Date {
  // Extract hours and minutes from the given date
  let hours: number = date.getHours();
  let minutes: number = date.getMinutes();
  
  // Calculate the total minutes
  let totalMinutes: number = hours * 60 + minutes;
  
  // Check if the current time exceeds the next 30-minute interval
  if (minutes > 30) {
    // Round up to the next hour and set minutes to 0
    hours++;
    minutes = 0;
  } else {
    // Round up to the next 30-minute interval
    minutes = 30;
  }
  
  // Set the updated time on the date object
  date.setHours(hours, minutes, 0, 0);
  
  return date;
}

export function setToNextDayIfPastClosingTime(date: Date, closingTime: Date): Date {
  // Compare the given date with the closing time
  if (compareDateTimes(date, closingTime) > 0) {
    // If the given date is past the closing time, set it to the next day
    date.setDate(date.getDate() + 1);
  }
  
  return date;
}

export const getEarliestTime = (times: string[]) => {
  if (times.length === 0) {
    return ""; // Return an empty string for masseuses with no available times
  }

  // Extract the start time from the first element in the array
  const startTime = times[0].split(" - ")[0];
  return startTime;
};

export const isNumberInRange = (number: number, range: number[]): boolean => {
  const [start, end] = range;
  return number >= start && number <= end;
};

export const hasNumberOutsideRange = (numbers: number[], range: number[]): boolean => {
  for (const number of numbers) {
    if (!isNumberInRange(number, range)) {
      return true; // There is a number outside the range
    }
  }
  return false; // All numbers are within the range
};

export function getLastDayOfMonth(inputDate: Date): Date {
  // Get the next month by adding 1 to the current month
  const nextMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);

  // Return the last day of the month
  return nextMonth;
}

export function getFirstDayOfNextMonth(inputDate: Date): Date {
    // Get the next month by adding 1 to the current month
    const nextMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 1);

    // Return the first day of the next month
    return nextMonth;
}

export function getLastElement<T>(arr: T[]): T | undefined {
  if (arr.length === 0) {
      return undefined; // Return undefined if the array is empty
  }
  return arr[arr.length - 1]; // Return the last element of the array
}