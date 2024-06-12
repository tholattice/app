import { AppointmentFormProps } from "@/lib/types/types";
import { extractDate } from "@/utils/format";
import {
  compareDateTimes,
  getEarliestTime,
  isSameDay,
  isToday,
} from "@/utils/misc";

import Modal from "@/components/Modal";

import MasseuseAvatar, { getAvailableTimes } from "./Avatar";
import {
  SampleMasseuseProps,
  StoreHours,
  WorkingHours,
  storeHours,
} from "./Form";

export interface MasseuseSelectionProps {
  data: AppointmentFormProps;
  sampleMasseuses: SampleMasseuseProps[];
  // handleMasseuseSelection: (masseuseSelection: string[]) => void;
  handleModalToggle: (index: number) => void;
  isModalOpen: boolean[];
}

export function findMatchingDay(
  date: Date,
  storeHours: StoreHours
): WorkingHours | undefined {
  const matchingDay = storeHours.workingHours.find((day) => {
    const dayStart = day.start;
    return (
      dayStart.getFullYear() === date.getFullYear() &&
      dayStart.getMonth() === date.getMonth() &&
      dayStart.getDate() === date.getDate()
    );
  });

  return matchingDay;
}

export function findMatchingWorkingHours(date: Date, storeHours: StoreHours) {
  const matchingDay = findMatchingDay(date, storeHours);
  return matchingDay ? { ...matchingDay } : storeHours.workingHours[0];
}

export function updateSelectedDateTime(
  date: Date,
  storeHours: StoreHours
): Date {
  const matchingWorkingHours = findMatchingWorkingHours(date, storeHours);

  if (matchingWorkingHours) {
    // if (isToday(date)) {
    // const result = compareDateTimes(date, matchingWorkingHours.start);
    // console.log(`result is ${result}`, date, matchingWorkingHours.start);
    // date = new Date(matchingWorkingHours.start);

    // if (result < 0) {
    //   date = new Date(matchingWorkingHours.start);
    // }
    // } else {
    date = new Date(matchingWorkingHours.start);
    // }
  }

  return date;
}

// Update masseuse working hours if matchingWorkingHours falls on same day as start or end. Helps maintain time consistency
export const updatedMasseuseWorkingHours = (
  masseuseWorkingHours: WorkingHours,
  matchingWorkingHours: WorkingHours
): WorkingHours => {
  const updatedWorkingHours = { ...matchingWorkingHours };

  if (isSameDay(masseuseWorkingHours.start, matchingWorkingHours.start)) {
    updatedWorkingHours.start = masseuseWorkingHours.start;
  }

  if (isSameDay(masseuseWorkingHours.end, matchingWorkingHours.end)) {
    updatedWorkingHours.end = masseuseWorkingHours.end;
  }

  return updatedWorkingHours;
};

export const filteredMasseuses = (
  data: AppointmentFormProps,
  sampleMasseuses: SampleMasseuseProps[],
  customDate?: Date
) =>
  sampleMasseuses.filter((masseuse) => {
    const selectedDateTime = updateSelectedDateTime(
      customDate || data.selectedDateTime,
      storeHours
    )!;

    const matchingWorkingHours = storeHours.workingHours.find(
      // (day) => day.start.getDate() === selectedDateTime.getDate()
      (day) => isSameDay(day.start, selectedDateTime)
    ) || { start: new Date(), end: new Date() };

    // console.log("these are the matching working hours", matchingWorkingHours);

    const isStoreOpen =
      compareDateTimes(matchingWorkingHours.start, matchingWorkingHours.end) <
      0;

    // Check if the selected date is within the working hours of the masseuse
    const isWithinWorkingHours =
      updatedMasseuseWorkingHours(masseuse.workingHours, matchingWorkingHours)
        .start >= matchingWorkingHours.start &&
      updatedMasseuseWorkingHours(masseuse.workingHours, matchingWorkingHours)
        .end <= matchingWorkingHours.end;

    // console.log(isWithinWorkingHours);

    // Check if selected time only is within store time hours by day of the

    // Check if there are no appointments for the selected date
    const hasAvailableOpenings = masseuse.appointments.every((appointment) => {
      return (
        matchingWorkingHours.start < appointment.start ||
        matchingWorkingHours.end >= appointment.end
      );
    });

    // Check if the store is not closed on the selected date (not a holiday)
    // TODO: Problem with this so far is that selectedDateTime is not considering the exact/final time which user would like to schdule appointment.
    // const isWithinHolidayHours = !storeHours.holidayHours?.some((holiday) => {
    //   return (
    //     matchingWorkingHours.start >= holiday.start &&
    //     matchingWorkingHours.end < holiday.end
    //   );
    // });

    const isHolidayOpen =
      storeHours.holidayHours?.find((holiday) => {
        return isSameDay(holiday.start, matchingWorkingHours.start);
      })?.open ?? true;

    // console.log(isHolidayOpen, "isHolidayOpen", matchingWorkingHours.start);

    // console.log("isHolidayOpen", isHolidayOpen);

    // Check if masseuse meets gender preferences
    const isGenderPreferenceMet =
      data.masseusePreferences.gender === "either" ||
      masseuse.gender === data.masseusePreferences.gender;

    // Check if the masseuse provides the selected massage type
    const providesSelectedMassageType = masseuse.servicesOffered.some(
      (service) => service.type === data.massageType
    );

    // Check if the masseuse provides the selected massage pressure
    const providesSelectedMassagePressure = masseuse.servicesOffered.some(
      (service) => service.pressures.includes(data.pressure)
    );

    // Check if masseuse provides solo or couples massage

    const providesSelectedSoloOrCouples = masseuse.servicesOffered.some(
      (service) => service.soloOrCouples.includes(data.soloOrCouples)
    );

    // Check if a specific massseuse is chosen
    const isSpecificMasseuseChosen = data.selectedMasseuses.includes(
      masseuse.name.toLowerCase()
    );

    // Return true if all conditions are met
    return (
      isWithinWorkingHours &&
      // isWithinSameDayStoreHours &&
      isHolidayOpen &&
      isStoreOpen &&
      hasAvailableOpenings &&
      isGenderPreferenceMet &&
      // isWithinHolidayHours &&
      providesSelectedMassageType &&
      providesSelectedMassagePressure &&
      providesSelectedSoloOrCouples &&
      isSpecificMasseuseChosen
    );
  });

const MasseuseSelection: React.FC<MasseuseSelectionProps> = ({
  data,
  sampleMasseuses,
  // handleMasseuseSelection,
  handleModalToggle,
  isModalOpen,
}) => {
  // const [selectedMasseuses, setSelectedMasseuses] = useState<string[]>(
  //   data.selectedMasseuses
  // );

  // const toggleMasseuseSelection = (masseuse: string) => {
  //   const updatedMasseuses = data.selectedMasseuses.includes(masseuse)
  //     ? data.selectedMasseuses.filter((selected) => selected !== masseuse)
  //     : [...data.selectedMasseuses, masseuse];

  //   handleMasseuseSelection(updatedMasseuses);
  // };

  const sortedMasseuses = filteredMasseuses(data, sampleMasseuses)
    .slice()
    .sort((a, b) => {
      const extractedDate = extractDate(data.selectedDateTime);

      const availableTimesA = getAvailableTimes(
        data.selectedDateTime,
        a,
        storeHours
      );
      const availableTimesB = getAvailableTimes(
        data.selectedDateTime,
        b,
        storeHours
      );

      const earliestTimeA = getEarliestTime(availableTimesA);
      const earliestTimeB = getEarliestTime(availableTimesB);

      // Compare earliest available times
      const timeComparison =
        new Date(`${extractedDate} ${earliestTimeA}`).getTime() -
        new Date(`${extractedDate} ${earliestTimeB}`).getTime();

      // Check if preferredTimes is provided
      if (data.preferredTimes) {
        // Calculate the number of available openings for each masseuse based on preferences
        const calculateOpenings = (
          masseuse: SampleMasseuseProps,
          preferredTime: string
        ) => {
          const availableTimes = getAvailableTimes(
            data.selectedDateTime,
            masseuse,
            storeHours
          );

          // Count openings within the specified time range
          return availableTimes.filter((time) => {
            const startTime = parseInt(time.split(" - ")[0].split(":")[0], 10);

            interface TimeRange {
              start: number;
              end: number;
            }

            const timeRanges: { [key: string]: TimeRange } = {
              morning: { start: 0, end: 12 },
              afternoon: { start: 12, end: 18 },
              evening: { start: 18, end: 24 },
            };

            return (
              startTime >=
                timeRanges[preferredTime as keyof typeof timeRanges].start &&
              startTime <
                timeRanges[preferredTime as keyof typeof timeRanges].end
            );
          }).length;
        };

        // Iterate over preferredTimes and compare the number of openings
        for (const preferredTime of data.preferredTimes) {
          const openingsA = calculateOpenings(a, preferredTime);
          const openingsB = calculateOpenings(b, preferredTime);

          // If openings are different, sort by the greatest number of openings
          if (openingsA !== openingsB) {
            return openingsB - openingsA;
          }
        }
      }

      // If openings are equal or no preferredTimes are provided, use the timeComparison
      return timeComparison;
    });

  return (
    // <div>
    <div className="flex flex-col gap-4">
      {sortedMasseuses.map((masseuse, index) => (
        <div key={masseuse.id} className="flex w-full justify-center">
          <MasseuseAvatar
            data={data}
            masseuse={masseuse}
            storeHours={storeHours}
            handleModalToggle={handleModalToggle}
            isModalOpen={isModalOpen}
            selectedMasseuses={data.selectedMasseuses}
            index={index}
          />
          <div className={isModalOpen[index] ? "block" : "hidden"}>
            {isModalOpen[index] && (
              <Modal
                isOpen={isModalOpen[index]}
                onChange={() => handleModalToggle(index)}
                title={masseuse.name}
                description={`Awesome Description of ${masseuse.name}`}
                // index={index}
              >
                This is random children
              </Modal>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasseuseSelection;

// Unused functions
// function alignDateWithStoreHours(
//   date: Date,
//   storeHours: StoreHours
// ): WorkingHours | null {
//   const matchingDay = findMatchingDay(date, storeHours);

//   if (matchingDay) {
//     const dayStart = new Date(matchingDay.start);
//     console.log(`this is the day start: ${dayStart.getDate()}`);
//     console.log(`this is the date: ${date.getDate()}`);
//     if (date.getDate() !== dayStart.getDate() || date < dayStart) {
//       // Set the day to match storeHoursForDay
//       // console.log("yes this is working");
//       date.setDate(dayStart.getDate());
//       date.setMonth(dayStart.getMonth());
//       date.setFullYear(dayStart.getFullYear());
//       // Set the time to match the start time of storeHoursForDay
//       date.setHours(dayStart.getHours());
//       date.setMinutes(dayStart.getMinutes());

//       const updatedMatchingDay: WorkingHours = {
//         ...matchingDay,
//         start: new Date(date),
//         end: new Date(matchingDay.end),
//       };
//       return updatedMatchingDay;
//     }
//   }

//   return null;
// }

/* {isModalOpen[index] && (
            <Modal
              isOpen={isModalOpen[index]}
              onChange={() => handleModalToggle(index)}
              title={masseuse.name}
              description={`Awesome Description of ${masseuse.name}`}
              // index={index}
            >
              This is random children
            </Modal>
          )} */

// </div>
