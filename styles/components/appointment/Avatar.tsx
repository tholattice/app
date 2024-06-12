import Image from "next/image";
import { Button } from "@material-tailwind/react";

import { cn } from "@/utils/merge";
import { formatTime } from "@/utils/format";
import { AppointmentFormProps } from "@/lib/types/types";

import { josefin } from "../../fonts/fonts";
import { SampleMasseuseProps, StoreHours, findLatestOpeningTime } from "./Form";
import { findMatchingDay } from "./Selection";
// import { useState } from "react";
// import Modal from "@/components/Modal";

interface MasseuseAvatarProps {
  data: AppointmentFormProps;
  masseuse: SampleMasseuseProps;
  storeHours: StoreHours;
  // toggleMasseuseSelection: (masseuse: string) => void;
  isModalOpen: boolean[];
  handleModalToggle: (index: number) => void;
  selectedMasseuses: string[];
  index: number;
}

interface IconProps {
  id: number;
  open: number;
}

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`h-5 w-5 transition-transform -rotate-90`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export function getAvailableTimes(
  selectedDate: Date,
  masseuse: SampleMasseuseProps,
  storeHours: StoreHours
): string[] {
  // Find the working hours for the day of the week
  const startDateObject = findLatestOpeningTime(
    selectedDate,
    selectedDate,
    9,
    0,
    21,
    0
  );
  const workingHours = findMatchingDay(startDateObject.start, storeHours) || {
    start: new Date(),
    end: new Date(),
  };

  // TODO: Check between store, holiday, and masseuse hours to see which has the smallest different in range between beginng and ending available times.

  // Helper function to check if a date string is valid
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const holidayHoursForDate = storeHours.holidayHours?.find(
    (holiday) => selectedDate >= holiday.start && selectedDate <= holiday.end
  );

  const adjustedWorkingHours = holidayHoursForDate || workingHours;
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const availableTimes: string[] = [];

  for (
    let i = adjustedWorkingHours.start.getTime();
    i <= adjustedWorkingHours.end.getTime();
    i += 30 * 60 * 1000
  ) {
    const timeSlotStart = new Date(i);
    timeSlotStart.setFullYear(startOfDay.getFullYear());
    timeSlotStart.setMonth(startOfDay.getMonth());
    timeSlotStart.setDate(startOfDay.getDate());

    const timeSlotEnd = new Date(i + 30 * 60 * 1000);
    timeSlotEnd.setFullYear(endOfDay.getFullYear());
    timeSlotEnd.setMonth(endOfDay.getMonth());
    timeSlotEnd.setDate(endOfDay.getDate());

    if (
      timeSlotStart >= adjustedWorkingHours.start &&
      timeSlotEnd <= adjustedWorkingHours.end
    ) {
      const isBooked = masseuse.appointments.some(
        (appointment) =>
          timeSlotStart < appointment.end && timeSlotEnd > appointment.start
      );

      if (!isBooked) {
        availableTimes.push(
          `${formatTime(timeSlotStart)} - ${formatTime(timeSlotEnd)}`
        );
      }
    }
  }

  return availableTimes;
}

const MasseuseAvatar: React.FC<MasseuseAvatarProps> = ({
  data,
  masseuse,
  storeHours,
  // toggleMasseuseSelection,
  selectedMasseuses,
  isModalOpen,
  handleModalToggle,
  index,
}) => {
  const availableTimes = getAvailableTimes(
    data.selectedDateTime,
    masseuse,
    storeHours
  );

  // console.log("availableTime avatar", masseuse.name, availableTimes);
  // console.log("storehours", storeHours);

  return (
    <Button
      key={masseuse.id}
      // onClick={() => toggleMasseuseSelection(masseuse.name)}
      onClick={() => handleModalToggle(index)}
      className={cn(
        "text-black",
        selectedMasseuses.includes(masseuse.name)
          ? "bg-gray-300 bg-opacity-50"
          : "bg-white bg-opacity-90"
      )}
    >
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="shadow-md rounded-full grow-0 shrink-0 overflow-hidden h-20 w-20 border border-gray-100">
          <Image
            src={masseuse.image}
            alt={`${masseuse.name} Image`}
            height={100}
            width={100}
            className="rounded-full"
          />
        </div>
        <div
          className={cn(
            josefin.className,
            "flex flex-col justify-center items-center text-lg"
          )}
        >
          <h2>{masseuse.name}</h2>
          <p className="text-sm">
            Hours:{" "}
            {availableTimes.length > 0 && (
              <>
                {availableTimes[0].split(" - ")[0]} -{" "}
                {availableTimes.length >= 1
                  ? availableTimes[availableTimes.length - 1].split(" - ")[1]
                  : availableTimes[0]}
              </>
            )}
          </p>
        </div>
        <div>{Icon()}</div>
      </div>
    </Button>
  );
};

export default MasseuseAvatar;
