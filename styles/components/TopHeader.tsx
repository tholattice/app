import Link from "next/link";

import { CiClock1, CiPhone, CiLocationOn } from "react-icons/ci";
import { FaFacebookF, FaYelp, FaInstagram } from "react-icons/fa";
import { LayoutInterface } from "../layouts/layouts";
import { formatPhoneNumber } from "@/utils/format";

const TopHeader = ({ data: props }: { data: LayoutInterface }) => {
  // TODO: Work on the data props for these to fill in for time, phone, address, and socials
  return (
    <div className="bg-[#EFF0FB] border-b transition-all border-gray-200 w-full">
      <div className="flex flex-row max-w-screen-xl p-2 px-4 sm:px-8 md:px-12 lg:px-18 w-full m-auto justify-between items-center font-medium text-sm">
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-2 justify-between items-center text-black text-opacity-50">
            <CiClock1 /> Time
          </div>
          <div className="hidden md:flex flex-row gap-2 justify-between items-center text-black text-opacity-50">
            <Link
              className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease"
              href={`tel:${props.location?.phoneNumber}`}
            >
              {/* TODO: Add real telephone number, not yours. Needs to be properly formated as well */}
              <CiPhone />
            </Link>
            {formatPhoneNumber(props.location?.phoneNumber as string, false)}
          </div>
          <div className="hidden lg:flex flex-row gap-2 justify-between items-center text-black text-opacity-50">
            <CiLocationOn /> Address
          </div>
        </div>
        <div className="flex flex-row gap-6 transition-all">
          {/* TODO: add dynamic links based off of finished social media pages */}
          <Link
            className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease"
            href="https://www.yelp.com/"
          >
            <FaYelp />
          </Link>
          {/* <Link href="">
            <FaGoogle />
          </Link> */}
          {/* TODO: Not really sure how to point to Google my business page. Needs fixing */}
          <Link
            className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease"
            href="https://www.facebook.com/"
          >
            <FaFacebookF />
          </Link>
          <Link
            className="text-black text-opacity-50 hover:text-opacity-100 transition-all ease"
            href="https://www.instagram.com/"
          >
            <FaInstagram />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
