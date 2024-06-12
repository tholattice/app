import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Radio,
  // Select,
  Option,
  Checkbox,
} from "@material-tailwind/react";

import { cn } from "@/utils/merge";
import { capitalizeFirstLetter } from "@/utils/format";
import { AppointmentFormProps } from "@/lib/types/types";

import { josefin } from "../../fonts/fonts";
import { SampleMasseuseProps } from "./Form";
import AsyncSelect from "../AsyncSelect";

interface IconProps {
  id: number;
  open: number;
}

interface MasseusePreferenceProps {
  data: AppointmentFormProps;
  sampleMasseuses: SampleMasseuseProps[];
  handleMasseusePreferences: (
    preferenceChoice: string,
    fieldName: string
  ) => void;
  handlePreferredTimes: (selectedTime: string) => void;
  handleSelectMasseuses: (selectedMasseuse: string) => void;
}

function Icon({ id, open }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const filterSampleMasseuses = (
  sampleMasseuses: SampleMasseuseProps[],
  data: AppointmentFormProps
) => {
  return sampleMasseuses.filter((masseuse) =>
    data.masseusePreferences.gender !== "either"
      ? masseuse.gender === data.masseusePreferences.gender
      : masseuse
  );
};

const AppointmentFilter: React.FC<MasseusePreferenceProps> = ({
  data,
  sampleMasseuses,
  handleMasseusePreferences,
  handlePreferredTimes,
  handleSelectMasseuses,
}) => {
  const [open, setOpen] = useState<number>(0);
  const [selectedMasseuseRef, setSelectedMasseuseRef] = useState<
    string | undefined
  >(undefined);
  const [filteredSampleMasseuses, setFilteredSampleMasseuses] = useState<
    SampleMasseuseProps[]
  >(filterSampleMasseuses(sampleMasseuses, data));
  const handleOpen = (value: number) =>
    setOpen((prevOpen) => (prevOpen === value ? 0 : value));

  const handleSelectPreference = (fieldName: string, value: string) => {
    handleMasseusePreferences(value, fieldName);
  };

  const handleRadioChange = (value: string) => {
    if (value === "specific-masseuse") {
      handleSelectMasseuses(selectedMasseuseRef as string);
    }
  };

  useEffect(() => {
    const filteredMasseuses = filterSampleMasseuses(sampleMasseuses, data);
    setFilteredSampleMasseuses(filteredMasseuses);
    setSelectedMasseuseRef(undefined);
  }, [data.masseusePreferences.gender]);

  return (
    <div>
      <h2 className="m-4 text-center md:text-left text-xl text-extrabold">
        Filter results
      </h2>
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader
          className={josefin.className}
          onClick={() => handleOpen(1)}
        >
          Select Masseuses
        </AccordionHeader>
        <AccordionBody className={cn(josefin.className, "text-lg")}>
          <div className="flex flex-col gap-4">
            <Radio
              name="masseuse-selection"
              label="All masseuses"
              value="next-available"
              checked={data.masseusePreferences.preference === "next-available"}
              onChange={(e) => {
                handleSelectPreference("preference", e.target.value);
              }}
            />
            <Radio
              name="masseuse-selection"
              label="My favorites"
              value="favorite-masseuses"
              onChange={(e) =>
                handleSelectPreference("preference", e.target.value)
              }
            />
            <Radio
              name="masseuse-selection"
              label={
                <>
                  Specific masseuse
                  {data.masseusePreferences.gender === "either" ? (
                    ""
                  ) : (
                    <>
                      {" "}
                      -
                      <span className="text-red-500">
                        {` ${data.masseusePreferences.gender.toUpperCase()} ONLY`}
                      </span>
                    </>
                  )}
                </>
              }
              value="specific-masseuse"
              onChange={(e) => {
                handleSelectPreference("preference", e.target.value);
                handleRadioChange(e.target.value);
              }}
              checked={
                data.masseusePreferences.preference === "specific-masseuse"
              }
            />
            <AsyncSelect
              className={josefin.className}
              label="Select masseuse"
              value={selectedMasseuseRef}
              onChange={(value) => {
                handleSelectMasseuses(value as string);
                setSelectedMasseuseRef(value as string);
              }}
              disabled={
                data.masseusePreferences.preference !== "specific-masseuse"
              }
            >
              {filteredSampleMasseuses.map((masseuse, index) => {
                return (
                  <Option
                    key={masseuse.id}
                    className={cn(josefin.className, "text-lg my-2")}
                    value={masseuse.name.toLowerCase()}
                  >
                    {capitalizeFirstLetter(masseuse.name)}
                  </Option>
                );
              })}
            </AsyncSelect>
          </div>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
        <AccordionHeader
          className={josefin.className}
          onClick={() => handleOpen(2)}
        >
          Masseuse Gender
        </AccordionHeader>
        <AccordionBody className={cn(josefin.className, "text-lg")}>
          <div className="flex flex-col gap-4">
            {["male", "female", "either"].map((pref) => (
              <Radio
                key={pref}
                name="gender-selection"
                label={
                  pref === "either"
                    ? "Doesn't matter"
                    : capitalizeFirstLetter(pref)
                }
                value={pref}
                checked={data.masseusePreferences.gender === pref}
                onChange={(e) => {
                  handleSelectPreference("gender", e.target.value);
                  handleSelectPreference("preference", "next-available");
                  handleOpen(1);
                }}
              />
            ))}
          </div>
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
        <AccordionHeader
          className={cn(josefin.className, "text-lg")}
          onClick={() => handleOpen(3)}
        >
          Preferred Times
          {/* TODO: Mention how masseuses are sorted by most available openings within time slot */}
        </AccordionHeader>
        <AccordionBody className={cn(josefin.className, "text-lg")}>
          <div className="flex flex-col gap-4">
            {["morning", "afternoon", "evening"].map((time) => (
              <Checkbox
                key={time}
                className="p-3"
                checked={data.preferredTimes.includes(time)}
                value={time}
                onChange={(e) => handlePreferredTimes(e.target.value)}
                label={capitalizeFirstLetter(time)}
                icon={
                  <p>
                    {data.preferredTimes.indexOf(time) + 1 === 0
                      ? ""
                      : data.preferredTimes.indexOf(time) + 1}
                  </p>
                }
              />
            ))}
          </div>
        </AccordionBody>
      </Accordion>
    </div>
  );
};

export default AppointmentFilter;
