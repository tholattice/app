"use client";

import {
  ReactNode,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// import { AppointmentFormProps } from "@/lib/types/types";

interface IMobileMenuContext {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// interface IAppointmentFormContext {
//   appointmentFormData: AppointmentFormProps;
//   setAppointmentFormData: Dispatch<SetStateAction<AppointmentFormProps>>;
// }

export const MobileMenuContext = createContext<IMobileMenuContext>({
  open: false,
  setOpen: () => false,
});

// export const AppointmentFormContext = createContext<
//   IAppointmentFormContext | undefined
// >(undefined);

// Maybe consider passing in an actual object instead of string values in the future?

export default function Providers({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  // const [appointmentFormData, setAppointmentFormData] =
  //   useState<AppointmentFormProps>({
  //     soloOrCouples: "",
  //     massageType: "",
  //     fourHand: false,
  //     duration: 30,
  //     pressure: "",
  //     addons: [], // Ensure addons is initialized as an empty array
  //     preferredTimes: [],
  //     masseusePreferences: {
  //       gender: "",
  //       selection: [],
  //     },
  //     selectedMasseuses: [],
  //   });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileMenuContext.Provider value={{ open, setOpen }}>
        {/* <AppointmentFormContext.Provider
        value={{ appointmentFormData, setAppointmentFormData }}
      > */}
        {children}
        {/* </AppointmentFormContext.Provider> */}
      </MobileMenuContext.Provider>
    </LocalizationProvider>
  );
}

export const useMobileMenuContext = () => useContext(MobileMenuContext);
// export const useAppointmentFormContext = () => {
//   const context = useContext(AppointmentFormContext);
//   if (context === undefined) {
//     throw new Error(
//       "useAppointmentFormContext must be used within an AppointmentFormContextProvider"
//     );
//   }
//   return context;
// };
