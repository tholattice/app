"use client";

// import { format, startOfDay, startOfToday } from "date-fns";
import { useEffect, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import {
  DateCalendar,
  DayCalendarSkeleton,
  // DigitalClock,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";

import { AppointmentFormProps } from "@/lib/types/types";
// import { Badge } from "@mui/material";
import { cn } from "@/utils/merge";
import { isSameDay, isToday } from "@/utils/misc";

import {
  CheckIfPastClosingTimeAndGetDay,
  SampleMasseuseProps,
  StoreHours,
  WorkingHours,
  findLatestOpeningTime,
} from "./Form";
import { filteredMasseuses } from "./Selection";

import styles from ".././strikethrough.module.css";

interface MasseusePreferenceProps {
  data: AppointmentFormProps;
  sampleMasseuses: SampleMasseuseProps[];
  storeHours: StoreHours;
  handleDatePreference: (selectedDate: Date) => void;
}

// TODO: When you fetch data dynamically, it'll probably need to be a server action fetch data with ability to abort request. I'll write out functions here just to have them for now.

function fetchDatesWithNoMasseuses(
  data: AppointmentFormProps,
  sampleMasseuses: SampleMasseuseProps[],
  currentDate: Dayjs,
  endDate: Dayjs,
  dateRange: Dayjs[],
  { signal }: { signal: AbortSignal }
) {
  return new Promise<{ datesWithNoMasseuses: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const datesWithNoMasseuses = [];
      function isDateInRange(
        dateToCheck: Dayjs,
        [startDate, endDate]: Dayjs[]
      ): boolean {
        return (
          dateToCheck.isSame(startDate) ||
          (dateToCheck.isAfter(startDate) && dateToCheck.isBefore(endDate)) ||
          dateToCheck.isSame(endDate)
        );
      }

      while (currentDate <= endDate) {
        const filteredMasseusesList = filteredMasseuses(
          data,
          sampleMasseuses,
          currentDate.toDate()
        );

        if (
          filteredMasseusesList.length === 0 &&
          isDateInRange(currentDate, dateRange)
        ) {
          datesWithNoMasseuses.push(currentDate.date());
        }

        currentDate = currentDate.add(1, "day");
      }

      resolve({ datesWithNoMasseuses });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    };
  });
}

function NoAvailableDay(
  props: PickersDayProps<Dayjs> & { noAvailableDays?: number[] }
) {
  const {
    noAvailableDays = [],
    day,
    //@ts-ignore
    dateRange,
    outsideCurrentMonth,
    disabled,
    ...other
  } = props;

  // TODO: Fix this

  const isSelected =
    !outsideCurrentMonth && noAvailableDays.indexOf(day.date()) >= 0;

  const isDisabled = disabled || isSelected;

  const dayClasses = cn({
    [styles.strikethrough]: isSelected,
    [styles.cursorNotAllowed]: isDisabled,
  });

  return (
    // <Badge
    //   key={props.day.toString()}
    //   overlap="circular"
    //   badgeContent={isSelected ? "🌚" : undefined}
    //   className={isSelected ? "cursor-not-allowed" : ""}
    // >
    <span className={isDisabled ? "cursor-not-allowed" : ""}>
      <PickersDay
        key={day.toString()}
        className={dayClasses}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        disabled={isDisabled}
        {...other}
      />
    </span>
    // </Badge>
  );
}

function findWorkingHourAfterMatch(
  workingHours: WorkingHours[],
  inputDate: Date,
  daysOut: number
): WorkingHours | undefined {
  // Find index of the matching workingHours object
  const index = workingHours.findIndex((wh) => isSameDay(wh.start, inputDate));

  // Return the daysOut element after the matching workingHours object if it exists
  if (index !== -1 && index + daysOut < workingHours.length) {
    return workingHours[index + daysOut];
  }

  return undefined; // Return undefined if no match is found or index is out of bounds
}

function findMatchingDay(
  storeHours: StoreHours,
  inputDate: Dayjs
): WorkingHours {
  // const matchedDay = dayjs(
  //   storeHours.workingHours.find((date) =>
  //     dayjs(date.start).isSame(inputDate, "day")
  //   )?.start
  // );

  const matchedDate = storeHours.workingHours.find((date) =>
    dayjs(date.start).isSame(inputDate, "day")
  ) || { start: new Date(), end: new Date() };

  return matchedDate;
}

const AppointmentCalendar: React.FC<MasseusePreferenceProps> = ({
  data,
  sampleMasseuses,
  storeHours,
  handleDatePreference,
}) => {
  const requestAbortController = useRef<AbortController | null>(null);
  // TODO: See if you can refactor CheckIfPastClosingTimeAndGetDay and findLatestOpeningTime

  const matchingTodayWh = findMatchingDay(storeHours, dayjs(new Date()));

  const startDate = CheckIfPastClosingTimeAndGetDay(
    // matchingTodayWh.toDate(),
    new Date(),
    matchingTodayWh.start.getHours(),
    matchingTodayWh.start.getMinutes(),
    matchingTodayWh.end.getHours(),
    storeHours
  );

  const startDateObject = findLatestOpeningTime(
    startDate,
    startDate,
    // 9,
    findMatchingDay(storeHours, dayjs(startDate)).start.getHours(),
    findMatchingDay(storeHours, dayjs(startDate)).start.getMinutes(),
    findMatchingDay(storeHours, dayjs(startDate)).end.getHours(),
    findMatchingDay(storeHours, dayjs(startDate)).end.getMinutes()
  );
  // console.log("this is the startdate obj called", startDateObject);

  const today = dayjs(startDateObject.start);
  const startDayOfMonth = dayjs(today).startOf("month");
  const lastDayOfMonth = dayjs(today).endOf("month");

  const twoWeeksFromNow = dayjs(
    findWorkingHourAfterMatch(
      storeHours.workingHours,
      startDateObject.start,
      14
    )?.start
  );

  const dateRange = [today, twoWeeksFromNow];
  const [calendarDateRange, setCalendarDateRange] = useState<Dayjs[]>([
    dayjs(findMatchingDay(storeHours, startDayOfMonth).start),
    dayjs(findMatchingDay(storeHours, lastDayOfMonth).end),
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noAvailableDays, setNoAvailableDays] = useState<number[]>([]);

  const handleDateSelection = (newDate: Dayjs) => {
    // console.log("this is running");
    handleDatePreference(newDate.toDate());
  };
  // handleDateSelection(today);

  // TODO: See if useMemo might be better to use than useEffect?
  // const memoizedData = useMemo(() => {
  //   const { selectedDateTime, ...rest } = data;
  //   return rest;
  // }, [data.selectedDateTime]);

  const findDatesWithNoMasseuses = (
    data: AppointmentFormProps,
    currentDate: Dayjs,
    endDate: Dayjs
  ) => {
    const controller = new AbortController();

    fetchDatesWithNoMasseuses(
      data,
      sampleMasseuses,
      currentDate,
      endDate,
      dateRange,
      {
        signal: controller.signal,
      }
    )
      .then(({ datesWithNoMasseuses }) => {
        setNoAvailableDays(datesWithNoMasseuses);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  useEffect(() => {
    handleDateSelection(today);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    findDatesWithNoMasseuses(data, calendarDateRange[0], calendarDateRange[1]);
    // console.log("this is running useeffect");

    // if (!isToday(today)) {
    //   handleDateSelection(today);
    // }

    return () => requestAbortController.current?.abort();
  }, [
    data.addons,
    data.duration,
    data.fourHand,
    data.massageType,
    data.masseusePreferences,
    data.pressure,
    data.selectedMasseuses,
    data.soloOrCouples,
    // today,
    // memoizedData,
  ]);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    const matchingFirstDayOfMonth = dayjs(
      findMatchingDay(storeHours, date).start
    );
    const matchingLastDayOfMonth = dayjs(
      findMatchingDay(storeHours, date.endOf("month")).end
    );

    setIsLoading(true);
    setNoAvailableDays([]);
    setCalendarDateRange([matchingFirstDayOfMonth, matchingLastDayOfMonth]);
    findDatesWithNoMasseuses(
      data,
      matchingFirstDayOfMonth,
      matchingLastDayOfMonth
    );
  };

  return (
    <div>
      {/* <DatePicker /> */}
      {/* <StaticDateTimePicker defaultValue={today} /> */}
      <DateCalendar
        disablePast
        defaultValue={today}
        loading={isLoading}
        minDate={today}
        maxDate={twoWeeksFromNow}
        // value={selectedDate}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: NoAvailableDay,
        }}
        slotProps={{
          day: {
            noAvailableDays,
            dateRange,
          } as any,
        }}
        onChange={(newDate) => handleDateSelection(newDate)}
        onMonthChange={(month: Dayjs) => handleMonthChange(month)}
      />
      {/* <DigitalClock
        value={selectedTime}
        onChange={(newTime) => setSelectedTime(newTime)}
      /> */}
      {/* TODO: The DateCalendar and Digital Clock--probably in a single view widget like a DateTime widget--should also appear when the masseuses are clicked on, to show their availabilities. */}
    </div>
  );
};

export default AppointmentCalendar;
