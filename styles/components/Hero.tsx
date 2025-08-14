import NewHeroCarousel from "./NewHeroCarousel";

interface HeroProps {
  siteData?: {
    name?: string | null;
    description?: string | null;
    image?: string | null;
  };
}

const Hero = ({ siteData }: HeroProps) => {
  const slides = [
    {
      url: siteData?.image || "https://wallpaperxyz.com/wp-content/uploads/High-Quality-Wallpaper-Full-HD-Free-Download-for-Laptop-Desktop-PC-2610-Wallpaperxyz.com-21.jpg",
      title: siteData?.name || "Serene Beach",
    },
    {
      url: "https://wallpaperxyz.com/wp-content/uploads/High-Quality-Wallpaper-Full-HD-Free-Download-for-Laptop-Desktop-PC-2610-Wallpaperxyz.com-43.jpg",
      title: "Calm Farmland",
    },
  ];

  return <NewHeroCarousel slides={slides} siteData={siteData} />;
};

export default Hero;
