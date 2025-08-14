import { cn } from "@/utils/merge";
import { mrDeHaviland } from "../fonts/fonts";
import ServicesGrid from "./ServicesGrid";

interface ServicesProps {
  siteData?: {
    name?: string | null;
    description?: string | null;
  };
}

const Services = ({ siteData }: ServicesProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 p-4 px-6 pt-20 pb-12 md:pb-24 bg-gray-400 bg-opacity-10">
      <h1
        className={cn(
          "text-center text-4xl tracking-wide text-pink-100",
          mrDeHaviland.className
        )}
      >
        Welcome to
      </h1>
      <h2 className="text-center text-3xl sm:text-4xl text-black text-opacity-90 uppercase">
        {siteData?.name || "Name of Massage Place"}
      </h2>
      <h3
        className={cn("text-center text-xl pb-12 text-black text-opacity-50")}
      >
        {/* Note: Consider using serif font for better typography */}
        {siteData?.description || "Enjoy our high-end services offered by professional and experienced masseuses"}
      </h3>
      <ServicesGrid siteData={siteData} />
    </div>
  );
};

export default Services;
