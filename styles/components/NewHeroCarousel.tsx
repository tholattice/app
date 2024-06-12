"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@material-tailwind/react";
import AnimatePresenceWrapper from "@/components/AnimatePresenceWrapper";

import { useMobileMenuContext } from "@/app/[domain]/providers";
import { cn } from "@/utils/merge";

import { josefin, mrDeHaviland } from "../fonts/fonts";

const HeroCarousel = ({
  slides,
}: {
  slides: { url: string; title: string }[];
}) => {
  const { open } = useMobileMenuContext();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleDotClick = (index: number) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextSlide = (activeSlide + 1) % slides.length;

      setActiveSlide(nextSlide);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeSlide, slides]);

  return (
    <AnimatePresenceWrapper
      mode="wait"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
      variantsProvide={true}
      className="transition-all ease-out"
    >
      <div className={!open ? "relative w-full overflow-hidden" : "hidden"}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "opacity-0 transition-all duration-1000",
              activeSlide === index
                ? "opacity-100"
                : "absolute top-0 left-0 right-0 bottom-0"
            )}
          >
            <Image
              src={slide.url}
              alt={slide.title}
              width={1000}
              height={1000}
              priority
              className="h-full w-full object-cover"
              style={{ width: "100%", height: "100vw", maxHeight: "40rem" }}
            />
            <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/25 p-6 z-10">
              <div className="w-3/4 text-center md:w-2/4">
                <h2
                  className={cn(
                    "text-center text-2xl md:text-3xl lg:text-4xl tracking-wide text-white text-opacity-90 font-light pb-1",
                    mrDeHaviland.className
                  )}
                >
                  Visit one of our multiple
                </h2>
                <h1 className="mb-4 text-4xl lg:text-6xl text-white text-opacity-90">
                  {slide.title}
                </h1>
                <p className="mb-4 md:mb-6 opacity-80 font-normal text-md md:text-lg lg:text-xl text-white overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatem ea quo aspernatur? Libero atque id eos veniam,
                  asperiores doloremque aut fugiat velit sunt debitis molestias
                  at ipsum. Iure, sapiente aspernatur!
                </p>
                <div className="group transition-all duration-[400ms]">
                  <Link href="/schedule-appointment">
                    <Button
                      className={cn(
                        "bg-gray-50 group-hover:bg-pink-100 duration-[400ms]",
                        josefin.className
                      )}
                      style={{ boxShadow: "none", borderRadius: "0px" }}
                    >
                      <h3 className="font-extrabold text-md text-black opacity-90 group-hover:text-white duration-[400ms]">
                        Schedule Appointment
                      </h3>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-4">
          {slides.map((_, index) => (
            <span
              key={index}
              className={cn(
                'block h-3 cursor-pointer rounded-2xl transition-all content-[""]',
                activeSlide === index
                  ? "w-3 bg-white"
                  : "w-3 bg-white opacity-50"
              )}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </AnimatePresenceWrapper>
  );
};

export default HeroCarousel;
