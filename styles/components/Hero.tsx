import NewHeroCarousel from "./NewHeroCarousel";

const Hero = () => {
  const slides = [
    {
      url: "https://wallpaperxyz.com/wp-content/uploads/High-Quality-Wallpaper-Full-HD-Free-Download-for-Laptop-Desktop-PC-2610-Wallpaperxyz.com-21.jpg",
      title: "Serene Beach",
    },
    {
      url: "https://wallpaperxyz.com/wp-content/uploads/High-Quality-Wallpaper-Full-HD-Free-Download-for-Laptop-Desktop-PC-2610-Wallpaperxyz.com-43.jpg",
      title: "Calm Farmland",
    },
  ];

  return <NewHeroCarousel slides={slides} />;
};

export default Hero;
