"use client";

import { Carousel } from "@material-tailwind/react";

import Card, { CardInterface } from "./TestimonialCard";
import { useMobileMenuContext } from "@/app/[domain]/providers";

const TestimonialsCarousel = () => {
  const { open } = useMobileMenuContext();

  const sampleCustomers: CardInterface[] = [
    {
      description: "Wow, this is great! I'm coming back soon",
      headshot:
        "https://images.squarespace-cdn.com/content/v1/5f7359b579e51a7d39e29bbf/1684070707323-4NH40PM6NBAGXKEXONLT/best-black-actor-headshot-nyc-hancock-headshots-015.jpeg",
      name: "Alosha Keys",
    },
    {
      description:
        "Amazing, Ling Qi really knows how to give a mean massage. I honestly feel so much better now! Thank you. Try the foot and body massage. You won't regret it.",
      headshot:
        "https://i0.wp.com/headshotsla.com/wp-content/uploads/2021/02/Commercial-Headshots-LA_9728_123.jpg?ssl=1",
      name: "Wanda Sykes",
    },
    {
      description: "Amazing! Coming back shortly",
      headshot:
        "https://static.showit.co/1200/12cY08_BQialFWdKF1y8Lg/25111/headshots_myrtle_beach-_pasha_belman_myrtle_beach_headshots_for_professionals_-9.jpg",
      name: "Katelyn Jones",
    },
    {
      description:
        "Wow, Linda is excellent! I hope I can come back in the future and make use of her services. ",
      headshot:
        "https://images.squarespace-cdn.com/content/v1/592702373a04114633ee6536/1526588154869-XBVLUKKJZBQHV2X3EI98/Natural+Light+Actor+Headshot+in+NYC+-+Eden",
      name: "Jacob White",
    },
    {
      description:
        "Amazing, I can't believe this works! Beautiful masseuses. All around applauses",
      headshot:
        "https://images.squarespace-cdn.com/content/v1/592702373a04114633ee6536/1526588154869-XBVLUKKJZBQHV2X3EI98/Natural+Light+Actor+Headshot+in+NYC+-+Eden",
      name: "Jacob White",
    },
  ];

  const sampleCustomersMatrix = sampleCustomers.reduce(
    (accumulator, currentValue, index, array) => {
      if (index % 2 === 0) {
        const nextObject = array[index + 1];

        if (nextObject) {
          accumulator.push([currentValue, nextObject]);
        } else {
          accumulator.push([currentValue]);
        }
      }

      return accumulator;
    },
    [] as Array<[CardInterface, CardInterface] | [CardInterface]>
  );

  return (
    <>
      <Carousel
        className={!open ? "flex md:hidden overflow-hidden" : "hidden"}
        prevArrow={() => false}
        nextArrow={() => false}
        autoplay={true}
        autoplayDelay={5000}
        transition={{ duration: 0.75 }}
        loop={true}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-4">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-2 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i
                    ? "w-2 bg-black/50"
                    : "w-2  bg-black opacity-20"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        {sampleCustomers.map((customer) => (
          <div
            key={customer.name}
            className="flex flex-row p-2 pb-12 gap-8 justify-around items-center max-w-6xl m-auto"
          >
            <Card
              key={customer.name}
              description={customer.description}
              headshot={customer.headshot}
              name={customer.name}
            />
          </div>
        ))}
      </Carousel>
      <Carousel
        className={!open ? "hidden md:flex overflow-hidden" : "hidden"}
        prevArrow={() => false}
        nextArrow={() => false}
        autoplay={true}
        autoplayDelay={7500}
        transition={{ duration: 0.75 }}
        loop={true}
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-4">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-2 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i
                    ? "w-2 bg-black/50"
                    : "w-2  bg-black opacity-20"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
        {sampleCustomersMatrix.map((customer, index) => (
          <div
            key={index}
            className="flex flex-row p-2 pb-12 gap-4 justify-around items-center max-w-6xl m-auto"
          >
            <Card
              key={customer[0].name}
              description={customer[0].description}
              headshot={customer[0].headshot}
              name={customer[0].name}
            />
            {customer[1] && (
              <Card
                key={customer[1].name}
                description={customer[1].description}
                headshot={customer[1].headshot}
                name={customer[1].name}
              />
            )}
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default TestimonialsCarousel;
