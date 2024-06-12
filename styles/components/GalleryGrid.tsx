import Image from "next/image";
import Link from "next/link";

import { useMobileMenuContext } from "@/app/[domain]/providers";

export interface GalleryInterface {
  image: string;
  headline: string;
  tag: string | undefined;
  slug: string;
}

const GalleryGrid = () => {
  const sampleGallery: GalleryInterface[] = [
    {
      image:
        "https://jacqueline.themerex.net/wp-content/uploads/2020/04/post33-copyright.jpg",
      headline: "relaxing massage",
      tag: "beauty",
      slug: "post1",
    },
    {
      image:
        "https://jacqueline.themerex.net/wp-content/uploads/2020/04/post32-copyright-1024x854.jpg",
      headline: "aromatherapy session",
      tag: "beauty",
      slug: "post2",
    },
    {
      image:
        "https://jacqueline.themerex.net/wp-content/uploads/2021/06/post19-copyright-1024x683.jpg",
      headline: "face care procedures",
      tag: "beauty",
      slug: "post1",
    },
    {
      image:
        "https://jacqueline.themerex.net/wp-content/uploads/2021/06/post18-copyright-1024x683.jpg",
      headline: "face building",
      tag: "beauty",
      slug: "post2",
    },
    {
      image:
        "https://jacqueline.themerex.net/wp-content/uploads/2021/06/post18-copyright-1024x683.jpg",
      headline: "face building",
      tag: "beauty",
      slug: "post2",
    },
  ];

  const { open } = useMobileMenuContext();

  return (
    <div
      className={
        !open
          ? "grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 py-2 w-full m-auto overflow-hidden"
          : "hidden"
      }
    >
      {sampleGallery.slice(0, 4).map((img, index) => (
        <div
          key={index}
          className={`group transition-all overflow-hidden h-min
          ${index === 1 || index === 2 ? "lg:col-span-1" : "lg:col-span-2"}`}
        >
          <Link className="relative" href={`/blog/${img.slug}`}>
            <Image
              src={img.image}
              alt={`${img.headline} Image`}
              height={450}
              width={450}
              // fill={true}
              // objectFit="cover"
              // style={{ height: "auto" }}
              className="h-full w-full object-cover transition-all duration-[750ms] delay-[25ms] group-hover:scale-110"
              style={{ width: "100%", height: "100vw", maxHeight: "20rem" }}
            />
            <div className="bg-black opacity-90 absolute bottom-20 left-5 p-1.5">
              <h2 className="text-white text-md xl:text-xl lg:text-lg opacity-90 uppercase">
                {img.headline}
                {index}
              </h2>
            </div>
            <div className="bg-black opacity-90 text-sm absolute bottom-10 left-5 p-1.5">
              <h3 className="text-white text-sm opacity-90 uppercase">
                {img.tag}
              </h3>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
