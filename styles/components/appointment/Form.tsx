"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@material-tailwind/react";

// import Modal from "react-modal";

// import prisma from "@/lib/prisma";
import { useMobileMenuContext } from "@/app/[domain]/providers";
import { AppointmentFormProps } from "@/lib/types/types";
import { capitalizeFirstLetter } from "@/utils/format";
import {
  getFirstDayOfNextMonth,
  getLastDayOfMonth,
  isSameDay,
  isToday,
  setToNext30MinuteInterval,
  setToNextDayIfPastClosingTime,
} from "@/utils/misc";

import MasseuseSelection from "./Selection";
import AppointmentCalendar from "./Calendar";
import AppointmentFilter from "./Filter";
import Modal from "@/components/Modal";

// import { useAppointmentFormContext } from "@/app/[domain]/providers";

// Modal.setAppElement("#__next");

// TODO: Make sure to implement a modal to show when user attempts to use the browser back button to navigate to previous step in questionnaire. The modal needs to warn the user that the form selection will restart to the first question when this happens.

// Looks like I didn't need to create a separate provider for the appointment schedule. It just needed to be properly displayed in the TSX return section

export interface WorkingHours {
  // weekDay: number;
  start: Date;
  end: Date;
}

interface HolidayHours {
  open: boolean;
  start: Date;
  end: Date;
}

interface Appointment {
  start: Date;
  end: Date;
}

interface ServiceOffered {
  type: string;
  soloOrCouples: string[];
  pressures: string[];
  addons: string[];
  durations: number[];
}

export interface SampleMasseuseProps {
  id: number;
  name: string;
  gender: string;
  workingHours: WorkingHours;
  appointments: Appointment[];
  servicesOffered: ServiceOffered[];
  image: string;
}

export interface StoreHours {
  workingHours: WorkingHours[];
  holidayHours: HolidayHours[] | null;
}

export const sampleMasseuses: SampleMasseuseProps[] = [
  {
    id: 1,
    name: "Yuki",
    gender: "female",
    workingHours: {
      start: new Date("2024-02-02T09:00:00"),
      end: new Date("2024-03-04T12:00:00"),
    },
    appointments: [
      {
        start: new Date("2024-02-05T09:00:00"),
        end: new Date("2024-02-05T09:30:00"),
      },
      {
        start: new Date("2024-02-12T09:00:00"),
        end: new Date("2024-02-12T09:30:00"),
      },
      {
        start: new Date("2024-02-13T09:00:00"),
        end: new Date("2024-02-13T09:30:00"),
      },
      {
        start: new Date("2024-02-13T09:30:00"),
        end: new Date("2024-02-13T10:00:00"),
      },
      {
        start: new Date("2024-02-15T10:00:00"),
        end: new Date("2024-02-15T10:30:00"),
      },
      {
        start: new Date("2024-02-19T09:00:00"),
        end: new Date("2024-02-19T10:00:00"),
      },
      {
        start: new Date("2024-02-20T10:30:00"),
        end: new Date("2024-02-20T11:00:00"),
      },
    ],
    servicesOffered: [
      {
        type: "body",
        soloOrCouples: ["solo", "couples"],
        pressures: ["light", "medium", "firm"],
        addons: ["cupping"],
        durations: [30, 60],
      },
      {
        type: "body",
        soloOrCouples: ["couples"],
        pressures: ["light", "medium"],
        addons: ["cupping", "backwalking", "tigerbalm"],
        durations: [90],
      },
      {
        type: "foot",
        soloOrCouples: ["solo", "couples"],
        pressures: [],
        addons: [],
        durations: [30, 60, 90],
      },
    ],
    image:
      "https://images.pexels.com/photos/1690744/pexels-photo-1690744.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  {
    id: 2,
    name: "Kiki",
    gender: "female",
    workingHours: {
      start: new Date("2024-01-22T09:00:00"),
      end: new Date("2024-02-26T18:00:00"),
    },
    appointments: [],
    servicesOffered: [
      {
        type: "body",
        soloOrCouples: ["solo"],
        pressures: ["light", "medium", "firm"],
        addons: ["cupping"],
        durations: [30, 60, 90],
      },
    ],
    image: "https://c.stocksy.com/a/TTM800/z9/1993019.jpg",
  },
  {
    id: 3,
    name: "Mimi",
    gender: "male",
    workingHours: {
      start: new Date("2024-01-22T09:00:00"),
      end: new Date("2024-03-18T18:00:00"),
    },
    appointments: [
      {
        start: new Date("2024-02-06T10:30:00"),
        end: new Date("2024-02-06T11:00:00"),
      },
      {
        start: new Date("2024-02-09T09:30:00"),
        end: new Date("2024-02-09T10:00:00"),
      },
      {
        start: new Date("2024-02-12T10:00:00"),
        end: new Date("2024-02-12T10:30:00"),
      },
      {
        start: new Date("2024-02-15T10:30:00"),
        end: new Date("2024-02-15T11:00:00"),
      },
      {
        start: new Date("2024-02-15T14:30:00"),
        end: new Date("2024-02-15T15:00:00"),
      },
      {
        start: new Date("2024-02-17T11:00:00"),
        end: new Date("2024-02-17T11:30:00"),
      },
      {
        start: new Date("2024-03-06T20:30:00"),
        end: new Date("2024-03-06T21:00:00"),
      },
    ],
    servicesOffered: [
      {
        type: "foot",
        soloOrCouples: ["solo", "couples"],
        pressures: ["light"],
        // TODO: find a way of ensuring that if user doesn't select a pressure, and masseuse doesn't provide a pressure, then the masseuse will still appear as an option? Figure out logic for this.
        addons: [],
        durations: [30, 60, 90],
      },
      {
        type: "body",
        soloOrCouples: ["solo", "couples"],
        pressures: ["light", "medium", "firm"],
        // TODO: find a way of ensuring that if user doesn't select a pressure, and masseuse doesn't provide a pressure, then the masseuse will still appear as an option? Figure out logic for this.
        addons: [],
        durations: [30, 60, 90],
      },
    ],
    image:
      "https://images.unsplash.com/photo-1616325629936-99a9013c29c6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXNpYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 4,
    name: "Coco",
    gender: "male",
    workingHours: {
      start: new Date("2024-02-29T09:00:00"),
      end: new Date("2024-03-04T18:00:00"),
    },
    appointments: [
      {
        start: new Date("2024-02-06T10:30:00"),
        end: new Date("2024-02-06T11:00:00"),
      },
      {
        start: new Date("2024-02-09T09:30:00"),
        end: new Date("2024-02-09T10:00:00"),
      },
      {
        start: new Date("2024-02-12T10:00:00"),
        end: new Date("2024-02-12T10:30:00"),
      },
      {
        start: new Date("2024-02-15T10:30:00"),
        end: new Date("2024-02-15T11:00:00"),
      },
      {
        start: new Date("2024-02-15T14:30:00"),
        end: new Date("2024-02-15T15:00:00"),
      },
      {
        start: new Date("2024-02-17T11:00:00"),
        end: new Date("2024-02-17T11:30:00"),
      },
      {
        start: new Date("2024-03-03T09:00:00"),
        end: new Date("2024-03-03T10:00:00"),
      },
      {
        start: new Date("2024-03-03T20:30:00"),
        end: new Date("2024-03-03T21:00:00"),
      },
      {
        start: new Date("2024-03-06T20:30:00"),
        end: new Date("2024-03-06T21:00:00"),
      },
    ],
    servicesOffered: [
      {
        type: "foot",
        soloOrCouples: ["solo", "couples"],
        pressures: ["light"],
        // TODO: find a way of ensuring that if user doesn't select a pressure, and masseuse doesn't provide a pressure, then the masseuse will still appear as an option? Figure out logic for this.
        addons: [],
        durations: [30, 60, 90],
      },
      {
        type: "body",
        soloOrCouples: ["solo", "couples"],
        pressures: ["light", "medium", "firm"],
        // TODO: find a way of ensuring that if user doesn't select a pressure, and masseuse doesn't provide a pressure, then the masseuse will still appear as an option? Figure out logic for this.
        addons: [],
        durations: [30, 60, 90],
      },
    ],
    // image: "/MaleAsianMasseuseImage.png",
    image:
      "https://i.pinimg.com/originals/49/53/0d/49530d5b544456631a5c8c95c6eafe5b.jpg",
    // "https://images.unsplash.com/photo-1616325629936-99a9013c29c6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXNpYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D",
  },
];

export const storeHours: StoreHours = {
  workingHours: [],
  holidayHours: [
    {
      open: true,
      start: new Date("2024-02-15T10:00:00"),
      end: new Date("2024-02-15T15:00:00"),
    },
    {
      open: true,
      start: new Date("2024-02-17T10:00:00"),
      end: new Date("2024-02-17T15:00:00"),
    },
    {
      open: true,
      start: new Date("2024-02-19T12:00:00"),
      end: new Date("2024-02-19T15:00:00"),
    },
    {
      open: false,
      start: new Date("2024-02-20T09:00:00"),
      end: new Date("2024-02-20T21:00:00"),
    },
    {
      open: false,
      start: new Date("2024-02-22T09:00:00"),
      end: new Date("2024-02-22T21:00:00"),
    },
    {
      open: true,
      start: new Date("2024-02-24T12:00:00"),
      end: new Date("2024-02-24T16:00:00"),
    },
    {
      open: false,
      start: new Date("2024-03-17T09:00:00"),
      end: new Date("2024-03-17T21:00:00"),
    },
    {
      open: false,
      start: new Date("2024-02-28T09:00:00"),
      end: new Date("2024-02-28T21:00:00"),
    },
  ],
};

export function findLatestOpeningTime(
  start: Date,
  end: Date,
  openingHour: number,
  openingMinutes: number,
  closingHour: number,
  closingMinutes: number
): WorkingHours {
  end.setHours(closingHour, closingMinutes, 0, 0);

  if (!isToday(start)) {
    start.setHours(openingHour, openingMinutes, 0, 0);
  } else {
    // console.log("its today", start);
    if (start.getHours() <= openingHour) {
      start.setHours(openingHour, openingMinutes, 0, 0);
    } else {
      const newStartDate = setToNext30MinuteInterval(start);
      start.setHours(newStartDate.getHours(), newStartDate.getMinutes(), 0, 0);
      // console.log("its past closing", start);
    }
  }

  // console.log({ start, end });

  return { start, end };
}

export function CheckIfPastClosingTimeAndGetDay(
  date: Date,
  openingHour: number,
  openingMinutes: number,
  closingHour: number,
  storeHours?: StoreHours
): Date {
  // let currentDate = new Date("2024-02-16T20:31:00");

  if (date.getHours() >= closingHour) {
    date.setDate(date.getDate() + 1);
    date.setHours(openingHour, openingMinutes, 0, 0);
  }

  if (storeHours) {
    let isHolidayOpen =
      storeHours.holidayHours?.find((holiday) => {
        return isSameDay(holiday.start, date);
      })?.open ?? true;

    while (!isHolidayOpen) {
      date.setDate(date.getDate() + 1);

      isHolidayOpen =
        storeHours.holidayHours?.find((holiday) => {
          return isSameDay(holiday.start, date);
        })?.open ?? true;

      // while (isHolidayOpen === false) {
      //   console.log("its this running?");
      //   date.setDate(date.getDate() + 1);
      // }
    }

    return date;
  }
  return date;
}

export function populateWorkingHours(
  openingHour: number,
  openingMinutes: number,
  closingHour: number,
  closingMinutes: number
): void {
  const newCurrentDate = CheckIfPastClosingTimeAndGetDay(
    new Date(),
    openingHour,
    openingMinutes,
    closingHour
  );

  const firstDayOfCurrentDayMonth = new Date(newCurrentDate.setDate(1));
  const lastDayOfCurrendDayMonth = getLastDayOfMonth(firstDayOfCurrentDayMonth);

  const firstDayOfCurrentDayNextMonth = getFirstDayOfNextMonth(
    firstDayOfCurrentDayMonth
  );
  const lastDayOfFirstDayOfNextMonth = getLastDayOfMonth(
    firstDayOfCurrentDayNextMonth
  );

  const totalDaysToLookout =
    lastDayOfFirstDayOfNextMonth.getDate() + lastDayOfCurrendDayMonth.getDate();

  // for (let i = 0; i < 15; i++) {
  for (let i = 0; i < totalDaysToLookout; i++) {
    const date = new Date(firstDayOfCurrentDayMonth);
    date.setDate(date.getDate() + i);

    const start = new Date(date);
    const end = new Date(date);

    const matchingHoliday = storeHours.holidayHours?.find((holiday) =>
      isSameDay(holiday.start, start)
    );

    // If a matching holiday is found, update working hours accordingly
    const openingHourToUse = matchingHoliday
      ? matchingHoliday.start.getHours()
      : openingHour;
    const openingMinutesToUse = matchingHoliday
      ? matchingHoliday.start.getMinutes()
      : openingMinutes;
    const closingHourToUse = matchingHoliday
      ? matchingHoliday.end.getHours()
      : closingHour;
    const closingMinutesToUse = matchingHoliday
      ? matchingHoliday.end.getMinutes()
      : closingMinutes;

    const resultingWorkingHours = findLatestOpeningTime(
      start,
      end,
      openingHourToUse,
      openingMinutesToUse,
      closingHourToUse,
      closingMinutesToUse
    );

    storeHours.workingHours.push(resultingWorkingHours);
  }
}

export function updateWorkingHoursPeriodically(
  openingHour: number,
  openingMinutes: number,
  closingHour: number,
  closingMinutes: number
): void {
  // Initial population of working hours
  populateWorkingHours(
    openingHour,
    openingMinutes,
    closingHour,
    closingMinutes
  );

  // Set interval to check and update working hours every hour
  setInterval(() => {
    const currentDate = new Date();
    // Check if weekDay 0 is equal to today's date
    if (storeHours.workingHours[0].start.getDate() !== currentDate.getDate()) {
      // Clear existing working hours
      storeHours.workingHours = [];

      // Populate working hours for the next 14 days
      populateWorkingHours(
        openingHour,
        openingMinutes,
        closingHour,
        closingMinutes
      );
    }
  }, 3600000); // Interval of 1 hour (in milliseconds)
}

// TODO: function should run based on hours located from prisma db.
populateWorkingHours(9, 0, 21, 0);
// updateWorkingHoursPeriodically(9, 0, 21, 0);

const AppointmentSchedulingForm = () => {
  const { open } = useMobileMenuContext();
  const [modalOpenStates, setModalOpenStates] = useState<boolean[]>(
    new Array(sampleMasseuses.length).fill(false)
  );
  const [question, setQuestion] = useState(1);

  const [appointmentFormData, setAppointmentFormData] =
    useState<AppointmentFormProps>({
      soloOrCouples: "",
      massageType: "",
      fourHand: false,
      duration: 30,
      pressure: "",
      addons: [] as string[],
      preferredTimes: [] as string[],
      masseusePreferences: {
        gender: "",
        preference: "",
      },
      selectedMasseuses: [] as string[],
      selectedDateTime: new Date(),
    });

  const addons = [
    { label: "Hot Stones", value: "hotstones" },
    { label: "Cupping", value: "cupping" },
    { label: "Back Walking", value: "backwalking" },
    { label: "Tiger Balm", value: "tigerbalm" },
  ];

  const router = useRouter();

  // TODO: Implement a better way of submitting forms...server actions?
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentFormData),
    });

    const data = await res.json();

    if (!res.ok) {
      // TODO: Implement a better way of indicating errrors using Toaster
      alert(data.message);
    } else {
      router.push("/");
      // TODO: Implement a router push to another url that shows the user their appointment details
    }
  };

  const handleModalToggle = (index: number) => {
    const updatedModalStates = [...modalOpenStates];
    updatedModalStates[index] = !updatedModalStates[index];

    setModalOpenStates(updatedModalStates);
  };

  const handleFormUpdate = (
    fieldName: keyof AppointmentFormProps,
    value: string | boolean | number,
    nextQuestion: number
  ) => {
    setAppointmentFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    setQuestion(nextQuestion);
  };

  const handleAddons = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentFormData((prevFormData) => {
      const updatedAddons = e.target.checked
        ? [...prevFormData.addons, e.target.value] // Add the value to addons array if checked
        : prevFormData.addons.filter((addon) => addon !== e.target.value); // Remove the value from addons array if unchecked

      return {
        ...prevFormData,
        addons: updatedAddons,
      };
    });
  };

  const handleMasseusePreferences = (
    preferenceChoice: string,
    fieldName: string
  ) => {
    setAppointmentFormData((prevFormData) => ({
      ...prevFormData,
      masseusePreferences: {
        ...prevFormData.masseusePreferences,
        [fieldName]: preferenceChoice,
      },
    }));

    if (preferenceChoice === "next-available") {
      setAppointmentFormData((prevFormData) => ({
        ...prevFormData,
        selectedMasseuses: sampleMasseuses.map((masseuse) =>
          masseuse.name.toLowerCase()
        ),
      }));
    }
  };

  const handleSelectMasseuses = (selectedMasseuse: string) => {
    setAppointmentFormData((prevFormData) => ({
      ...prevFormData,
      selectedMasseuses: [selectedMasseuse], // Replace the array with the selected masseuse
    }));
  };

  const handlePreferredTimes = (selectedTime: string) => {
    setAppointmentFormData((prevFormData) => {
      const isAlreadySelected =
        prevFormData.preferredTimes.includes(selectedTime);

      let updatedTimes;

      if (isAlreadySelected) {
        // If already selected, remove the time from the array
        updatedTimes = prevFormData.preferredTimes.filter(
          (time) => time !== selectedTime
        );
      } else {
        // If not selected, add the time to the end of the array
        updatedTimes = [...prevFormData.preferredTimes, selectedTime];
      }

      return {
        ...prevFormData,
        preferredTimes: updatedTimes,
      };
    });
  };

  const handleMasseuseSelection = (masseuseSelection: string[]) => {
    setAppointmentFormData((prevFormData) => ({
      ...prevFormData,
      selectedMasseuses: [...masseuseSelection],
    }));
  };

  const handleDatePreference = (selectedDate: Date) => {
    setAppointmentFormData((prevFormData) => ({
      ...prevFormData,
      selectedDateTime: selectedDate,
    }));
  };

  return (
    <div className={!open ? "block" : "hidden"}>
      {question === 1 && (
        <div>
          <h2>Would you like a solo or couple's massage?</h2>
          <Button onClick={() => handleFormUpdate("soloOrCouples", "solo", 2)}>
            Solo
          </Button>
          <Button
            onClick={() => handleFormUpdate("soloOrCouples", "couples", 2)}
          >
            Couples
          </Button>
        </div>
      )}

      {question === 2 && (
        <div>
          <h2>What type of massage would you like?</h2>
          <Button onClick={() => handleFormUpdate("massageType", "body", 3)}>
            Body
          </Button>
          <Button onClick={() => handleFormUpdate("massageType", "foot", 3)}>
            Foot
          </Button>
          {/* <Button onClick={() => setQuestion(3)}>Sauna</Button> */}
        </div>
      )}

      {question === 3 && (
        <div>
          <h2>Would you like a massage from two masseuses at the same time?</h2>
          <Button onClick={() => handleFormUpdate("fourHand", true, 4)}>
            Yes
          </Button>
          <Button onClick={() => handleFormUpdate("fourHand", false, 4)}>
            No
          </Button>
        </div>
      )}

      {question === 4 && (
        <div>
          <h2>What type of pressure would you like?</h2>
          <Button onClick={() => handleFormUpdate("pressure", "light", 5)}>
            Light
          </Button>
          <Button onClick={() => handleFormUpdate("pressure", "medium", 5)}>
            Medium
          </Button>
          <Button onClick={() => handleFormUpdate("pressure", "firm", 5)}>
            Firm
          </Button>
        </div>
      )}

      {question === 5 && (
        <div>
          <h2>How long would you like your massage to be?</h2>
          <Button onClick={() => handleFormUpdate("duration", 30, 6)}>
            30 Minutes
          </Button>
          <Button onClick={() => handleFormUpdate("duration", 60, 6)}>
            60 Minutes
          </Button>
          <Button onClick={() => handleFormUpdate("duration", 90, 6)}>
            90 Minutes
          </Button>
          {Object.entries(appointmentFormData).map(([key, val]) => (
            <p key={key}>
              {key}: {val.toString()}
            </p>
          ))}
        </div>
      )}

      {question === 6 && (
        <div>
          <h2>
            Would you like to enhance your massage with any of the following?
          </h2>
          <div className="grid max-w-xl">
            {addons.map((addon) => (
              <div
                key={addon.value}
                className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg"
              >
                <p>{addon.label}</p>
                <input
                  type="checkbox"
                  name="addons"
                  value={addon.value}
                  checked={appointmentFormData.addons.includes(addon.value)}
                  onChange={(e) => handleAddons(e)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {question === 7 && (
        <div>
          <h2>Rank your preferred times</h2>
          <div className="flex flex-col justify-center items-center gap-4 max-w-xl">
            {["Morning", "Afternoon", "Evening"].map((time) => (
              <div key={time} className="text-center">
                <p>{time}</p>
                <Button
                  onClick={() => handlePreferredTimes(time.toLowerCase())}
                  // Adjust the style or text based on the selection status
                  // You can customize this part according to your UI design
                  color={
                    appointmentFormData.preferredTimes.includes(
                      time.toLowerCase()
                    )
                      ? "blue"
                      : "gray"
                  }
                >
                  {appointmentFormData.preferredTimes.includes(
                    time.toLowerCase()
                  )
                    ? appointmentFormData.preferredTimes.indexOf(
                        time.toLowerCase()
                      ) + 1
                    : "Not Ranked"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {question === 8 && (
        <div>
          <div>
            <h2>Masseuse Preferences</h2>
            <Button
              className={
                appointmentFormData.masseusePreferences.gender === "male"
                  ? "bg-black bg-opacity-75"
                  : ""
              }
              onClick={() => handleMasseusePreferences("male", "gender")}
            >
              Male
            </Button>
            <Button
              className={
                appointmentFormData.masseusePreferences.gender === "female"
                  ? "bg-black bg-opacity-75"
                  : ""
              }
              onClick={() => handleMasseusePreferences("female", "gender")}
            >
              Female
            </Button>
            <Button
              className={
                appointmentFormData.masseusePreferences.gender === "either"
                  ? "bg-black bg-opacity-75"
                  : ""
              }
              onClick={() => handleMasseusePreferences("either", "gender")}
            >
              Doesn't Matter
            </Button>
          </div>
          <div>
            <Button
              className={
                appointmentFormData.masseusePreferences.preference ===
                "next-available"
                  ? "bg-black bg-opacity-75"
                  : ""
              }
              onClick={() =>
                handleMasseusePreferences("next-available", "preference")
              }
            >
              Next Available
            </Button>
            <Button
              className={
                appointmentFormData.masseusePreferences.preference ===
                "specific-masseuse"
                  ? "bg-black bg-opacity-75"
                  : ""
              }
              onClick={() =>
                handleMasseusePreferences("specific-masseuse", "preference")
              }
            >
              Specific Masseuse
            </Button>
          </div>
        </div>
      )}

      {question === 9 && (
        <div className="flex flex-col justify-center w-full md:flex-row gap-4">
          <div className="bg-gray-200 bg-opacity-20 p-8 flex flex-col rounded-lg">
            <h2 className="m-4 text-center md:text-left text-xl text-extrabold">
              Select a Date
            </h2>
            <div className="mb-10 mt-0 shadow-md m-auto p-4 rounded-lg">
              <AppointmentCalendar
                data={appointmentFormData}
                sampleMasseuses={sampleMasseuses}
                storeHours={storeHours}
                handleDatePreference={handleDatePreference}
              />
            </div>
            <div>
              <AppointmentFilter
                data={appointmentFormData}
                // question={question}
                sampleMasseuses={sampleMasseuses}
                handleMasseusePreferences={handleMasseusePreferences}
                handlePreferredTimes={handlePreferredTimes}
                handleSelectMasseuses={handleSelectMasseuses}
              />
            </div>
          </div>
          <div className="p-8">
            <h2 className="m-4 text-center md:text-left text-xl text-extrabold">
              {`${capitalizeFirstLetter(
                appointmentFormData.soloOrCouples
              )} ${capitalizeFirstLetter(
                appointmentFormData.massageType
              )} Massage - ${appointmentFormData.duration} min`}
            </h2>
            <h2 className="m-4 text-center md:text-left text-xl text-extrabold">
              Select Masseuses
            </h2>
            <MasseuseSelection
              data={appointmentFormData}
              sampleMasseuses={sampleMasseuses}
              // handleMasseuseSelection={handleMasseuseSelection}
              handleModalToggle={handleModalToggle}
              isModalOpen={modalOpenStates}
            />
          </div>
        </div>
      )}

      {question !== 1 ? (
        <Button className="" onClick={() => setQuestion(question - 1)}>
          Back
        </Button>
      ) : null}
      {question === 6 || question === 7 || question === 8 || question === 9 ? (
        <Button onClick={() => setQuestion(question + 1)}>Continue</Button>
      ) : null}

      {/* TODO: These buttons, probably all of the buttons imported from Material Tailwind are interfering with the Mobile Menu. Please fix */}
    </div>
  );
};

export default AppointmentSchedulingForm;

// Unused function:
// export function updateStoreHours(storeHours: StoreHours): StoreHours {
//   const today = new Date();
//   const todayWeekDay = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
//   const weekDayNumbers = storeHours.workingHours.map((hours) => hours.weekDay);
//   const newStoreHoursIndices = rearrangeArray(
//     weekDayNumbers as number[],
//     todayWeekDay
//   );

//   const updatedWorkingHours = storeHours.workingHours.map((hours, index) => {
//     // const diffWeekDay = Math.abs(hours.weekDay! - todayWeekDay);

//     // Update start and end dates without changing times
//     const newStart = new Date(today);
//     newStart.setDate(today.getDate() + newStoreHoursIndices[index]);
//     newStart.setHours(
//       hours.start.getHours(),
//       hours.start.getMinutes(),
//       hours.start.getSeconds()
//     );

//     const newEnd = new Date(today);
//     newEnd.setDate(today.getDate() + +newStoreHoursIndices[index]);
//     newEnd.setHours(
//       hours.end.getHours(),
//       hours.end.getMinutes(),
//       hours.end.getSeconds()
//     );

//     return { ...hours, start: newStart, end: newEnd };
//   });

//   const updatedStoreHours: StoreHours = {
//     ...storeHours,
//     workingHours: updatedWorkingHours,
//   };

//   return updatedStoreHours;
// }

// export function addAdditionalWorkingHours(storeHours: StoreHours): StoreHours {
//   if (storeHours.workingHours.length >= 14) {
//     // If there are already 14 days of working hours, return the original storeHours
//     return storeHours;
//   }

//   const updatedWorkingHours = [...storeHours.workingHours]; // Copy the original working hours

//   // Add additional 7 days of working hours
//   for (let i = 0; i < 7; i++) {
//     const lastDay = updatedWorkingHours[updatedWorkingHours.length - 1];
//     const nextDay = {
//       // weekDay: (lastDay.weekDay! + 1) % 7, // Increment weekDay cyclically
//       weekDay: lastDay.weekDay! + 1,
//       start: new Date(lastDay.start),
//       end: new Date(lastDay.end),
//     };

//     // Set hours and minutes
//     nextDay.start.setHours(9, 0, 0); // Set to 09:00:00
//     nextDay.end.setHours(21, 0, 0); // Set to 21:00:00

//     // Increment date
//     nextDay.start.setDate(nextDay.start.getDate() + 1);
//     nextDay.end.setDate(nextDay.end.getDate() + 1);

//     updatedWorkingHours.push(nextDay);
//   }

//   // Create a new StoreHours object with updated working hours
//   const updatedStoreHours: StoreHours = {
//     ...storeHours,
//     workingHours: updatedWorkingHours,
//   };

//   return updatedStoreHours;
// }
