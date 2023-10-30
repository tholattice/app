import Image from "next/image";

const SocialMediaLogos = () => {
  return (
    // <div className="flex flex-col lg:flex-row justify-center items-center gap-y-12 lg:max-w-xl p-4 lg:gap-x-24">
    <div className="opacity-90 grid grid-rows-2 grid-cols-2 max-w-xl place-items-center gap-8 md:grid-rows-1 md:grid-cols-4 md:gap-12">
      <div className="rounded-lg border border-gray-200 px-4">
        <Image
          src="/GMB-Logo.png"
          width={100}
          height={100}
          alt="Google My Business Logo"
        />
      </div>

      <Image src="/Yelp-Logo.png" width={135} height={135} alt="Yelp Logo" />
      <Image
        src="/Facebook-Logo.svg"
        width={140}
        height={140}
        alt="Facebook Logo"
      />
      <Image
        src="/Instagram-Logo.svg"
        width={140}
        height={140}
        alt="Instagram Logo"
      />
    </div>
  );
};

export default SocialMediaLogos;
