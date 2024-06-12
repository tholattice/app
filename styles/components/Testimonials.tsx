import { cn } from "@/utils/merge";
import { mrDeHaviland } from "../fonts/fonts";

import TestimonialsCarousel from "./TestimonialsCarousel";

const Testimonials = () => {
  return (
    <div className="bg-pink-50 bg-opacity-40 flex flex-col gap-4 justify-center items-center p-4 py-20 w-full m-auto">
      {/* Header */}
      <div>
        <h1
          className={cn(
            "text-center capitalize text-4xl leading-8 pb-4 tracking-wide text-pink-100",
            mrDeHaviland.className
          )}
        >
          Testimonials
        </h1>
        <h2 className="text-center leading-8 text-3xl sm:text-4xl text-black text-opacity-90 pb-4 uppercase">
          What People Say About Us
        </h2>
      </div>
      {/* Grid Carousel */}
      <TestimonialsCarousel />
    </div>
  );
};

export default Testimonials;
