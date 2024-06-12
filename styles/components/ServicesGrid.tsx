"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/utils/merge";
import { mrDeHaviland } from "../fonts/fonts";
import { useMobileMenuContext } from "@/app/[domain]/providers";

export interface ServicesInterface {
  image: string;
  headline: string;
  subtext: string;
  slug: string;
}

const sampleServices: ServicesInterface[] = [
  {
    image:
      "https://jacqueline.themerex.net/wp-content/uploads/2021/07/block-image-1-copyright.jpg",
    headline: "Weekly Deals",
    subtext: "Only for Newcomers",
    slug: "blog",
  },
  {
    image:
      "https://jacqueline.themerex.net/wp-content/uploads/2021/07/block-image-1-copyright.jpg",
    headline: "Massage Services",
    subtext: "Come one come all",
    slug: "about",
  },
  {
    image:
      "https://jacqueline.themerex.net/wp-content/uploads/2021/07/block-image-1-copyright.jpg",
    headline: "Schedule Appointment",
    subtext: "Dont miss out on scheduling your appointment today",
    slug: "schedule-appointment",
  },
];

const ServicesGrid = () => {
  const { open } = useMobileMenuContext();

  return (
    <div
      className={
        !open
          ? "grid grid-cols-1 md:grid-cols-3 gap-8 w-full xl:max-w-6xl"
          : "hidden"
      }
    >
      {sampleServices.map((service) => (
        <div
          key={service.headline}
          className="relative group transition-all h-min border-white border-opacity-90 border-4 mb-10 md:mb-0"
        >
          <div className="overflow-hidden">
            <Image
              src={service.image}
              alt={`${service.headline} Image`}
              width={500}
              height={500}
              className="h-full w-full object-cover transition-all duration-[750ms] delay-[25ms] group-hover:scale-110"
              // style={{ width: "100%", height: "100vw", maxHeight: "30rem" }}
            />
          </div>
          <div className="absolute w-full h-5 bottom-2 right-0 left-0 m-auto flex flex-col justify-center items-center">
            <div className="bg-white w-[90%] flex flex-col justify-center items-center">
              <div className="p-4">
                <h2
                  className={cn(
                    "text-center text-3xl tracking-wide text-pink-100 overflow-hidden text-ellipsis line-clamp-1",
                    mrDeHaviland.className
                  )}
                >
                  {service.headline}
                </h2>
                <p className="text-center uppercase overflow-hidden text-ellipsis line-clamp-1">
                  {service.subtext}
                </p>
              </div>
              {/* <div className=""> */}
              <Link
                className="p-2 bg-pink-100 w-full flex flex-row justify-center"
                href={`/${service.slug}`}
              >
                Click here
              </Link>
              {/* </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesGrid;

{
  /* <div className="flex flex-col justify-center items-center group rounded-lg gap-4 p-8 shadow-lg transition-all bg-pink-300 hover:bg-green-300">
        <div>Picture</div>
        <div>
          <h2 className="text-center transition-all group-hover:text-white">
            HOT STONES
          </h2>
        </div>
        <div>
          <p className="text-center">description of hot stones</p>
        </div>
        <div>Arrow pointing to page</div>
      </div>
      <div className="flex flex-col justify-center items-center group rounded-lg gap-4 p-8 shadow-lg transition-all bg-pink-300 hover:bg-green-300">
        <div>Picture</div>
        <div>
          <h2 className="text-center transition-all group-hover:text-blue-500">
            HOT STONES
          </h2>
        </div>
        <div>
          <p className="text-center">description of hot stones</p>
        </div>
        <div>Arrow pointing to page</div>
      </div>
      <div className="flex flex-col justify-center items-center rounded-lg gap-4 p-8 shadow-lg transition-all bg-pink-300 hover:bg-green-300">
        <div>Picture</div>
        <div>
          <h2 className="text-center">HOT STONES</h2>
        </div>
        <div>
          <p className="text-center">description of hot stones</p>
        </div>
        <div>Arrow pointing to page</div>
      </div> */
}
