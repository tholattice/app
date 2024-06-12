import Image from "next/image";

import RightQuotationMarks from "../icons/right-quotation-sign.svg";

export interface CardInterface {
  description: string | undefined;
  headshot: string | undefined;
  name: string | undefined;
}

const Card = ({ description, headshot, name }: CardInterface) => {
  return (
    <div className="bg-white bg-opacity-90 flex flex-col justify-between gap-2 shadow-sm p-8 w-full h-[20rem] m-auto">
      {/* TODO: Find way of preventing paragraph text from pushing name and headshot from spilling over, in case the customer testimonial is too long */}
      <div>
        <Image
          src={RightQuotationMarks}
          className="pb-4"
          alt="Right Quotation Marks"
          height={25}
          width={25}
        />
        <div className="max-h-40 overflow-hidden">
          <p className="text-black text-opacity-50 text-lg overflow-hidden text-ellipsis line-clamp-4">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 p-2">
        <div className="shadow-md rounded-full grow-0 shrink-0 overflow-hidden h-20 w-20 border border-gray-100">
          {headshot ? (
            <Image
              src={headshot}
              alt={`Customer ${name} Headshot Photo`}
              height={80}
              width={80}
              className="rounded-full"
            />
          ) : (
            "No headshot"
          )}
        </div>
        <div className="uppercase">{name}</div>
      </div>
    </div>
  );
};

export default Card;
