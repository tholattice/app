import { cn } from "@/utils/merge";
import { mrDeHaviland } from "../fonts/fonts";
import Image from "next/image";

const About = () => {
  return (
    <div className="m-auto grid grid-cols-1 sm:grid-cols-2 gap-4 xsm:p-4 sm:px-6 py-12 xl:max-w-6xl w-full">
      <div className="transition-all">
        <Image
          src="https://wallpaperxyz.com/wp-content/uploads/High-Quality-Wallpaper-Full-HD-Free-Download-for-Laptop-Desktop-PC-2610-Wallpaperxyz.com-21.jpg"
          alt="Beach About Photo"
          className="w-full h-full object-cover"
          width={500}
          height={500}
        />
      </div>
      <div className="p-6 px-8 flex flex-col justify-center">
        <h1
          className={cn(
            "text-left text-4xl leading-8 pb-4 tracking-wide text-pink-100",
            mrDeHaviland.className
          )}
        >
          About Us
        </h1>
        <h2 className="text-left leading-8 text-xl sm:text-2xl text-black text-opacity-90 pb-4 uppercase">
          Why We Are So Important
        </h2>
        <p className="text-left text-lg text-black text-opacity-50">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt eos
          repellendus atque, delectus, saepe sed quo dolorem voluptatem
          consectetur dolores facilis debitis illum quae voluptatibus iure
          molestias. Corporis, obcaecati dicta.
        </p>
      </div>
    </div>
  );
};

export default About;
