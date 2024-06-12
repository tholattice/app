"use client";

import Image from "next/image";
import Link from "next/link";
import { Carousel, Button } from "@material-tailwind/react";

import { useMobileMenuContext } from "@/app/[domain]/providers";
import { cn } from "@/utils/merge";

import { josefin, mrDeHaviland } from "../fonts/fonts";

const HeroCarousel = ({
  slides,
}: {
  slides: { url: string; title: string }[];
}) => {
  const { open } = useMobileMenuContext();

  return (
    <Carousel
      transition={{ duration: 1 }}
      className={!open ? "overflow-hidden" : "hidden"}
      prevArrow={() => false}
      nextArrow={() => false}
      autoplay={true}
      autoplayDelay={7500}
      loop={true}
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-4">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-3 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-3 bg-white" : "w-3 bg-white opacity-50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={"relative h-full w-full"}
          style={{
            opacity: index === 0 ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <Image
            src={slide.url}
            alt={slide.title}
            width={500}
            height={500}
            priority
            className="h-full w-full object-cover"
            style={{ width: "100%", height: "100vw", maxHeight: "40rem" }}
          />
          <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/25 p-6">
            <div className="w-3/4 text-center md:w-2/4">
              <h2
                className={cn(
                  mrDeHaviland.className,
                  "text-center text-2xl md:text-3xl lg:text-4xl tracking-wide text-white text-opacity-90 font-light pb-1"
                )}
              >
                Visit one of our multiple
              </h2>
              <h1 className="mb-4 text-4xl lg:text-6xl text-white tet-opacity-90">
                {slide.title}
              </h1>
              <p className="mb-4 md:mb-6 opacity-80 font-normal text-md md:text-lg lg:text-xl text-white overflow-hidden text-ellipsis line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatem ea quo aspernatur? Libero atque id eos veniam,
                asperiores doloremque aut fugiat velit sunt debitis molestias at
                ipsum. Iure, sapiente aspernatur!
              </p>
              <div className="">
                <Link
                  className="group transition-all duration-[400ms]"
                  href="/schedule-appointment"
                >
                  <Button
                    className={cn(
                      josefin.className,
                      "bg-gray-50 group-hover:bg-pink-100 duration-[400ms]"
                    )}
                    style={{ boxShadow: "none", borderRadius: "0px" }}
                    // size="lg"
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
    </Carousel>
  );
};

export default HeroCarousel;
