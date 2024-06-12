import localFont from "next/font/local";
import { Inter, Lora, Roboto, Work_Sans, Josefin_Sans, Mr_De_Haviland } from "next/font/google";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
});

export const calTitle = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  weight: "600",
  display: "swap",
});
export const lora = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
export const work = Work_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const roboto = Roboto({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "700",
  display: "swap"
})

export const josefin = Josefin_Sans({
  subsets:["latin"],
  weight: "300",
  display: "swap"
})

export const mrDeHaviland = Mr_De_Haviland({
  subsets:["latin"],
  weight: "400",
  display: "swap"
})

export const fontMapper = {
  "font-cal": calTitle.className,
  "font-lora": lora.className,
  "font-work": work.variable,
  "font-roboto": roboto.className,
  "font-josefin": josefin.className,
  "font-mrdehaviland": mrDeHaviland.className
} as Record<string, string>;