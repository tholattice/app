import Link from "next/link";
import { cn } from "@/utils/merge";

import SubFooter from "./SubFooter";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-pink-100 grid grid-cols-1 md:grid-cols-4 p-8 py-16 px-4 md:px-6 gap-8 md:gap-12 w-full max-w-7xl m-auto">
        <ul>
          <li>
            <h3 className="text-lg sm:text-xl text-black text-opacity-90 pb-2 uppercase">
              Hello
            </h3>
          </li>
          <li>
            <p className="text-left text-md text-black text-opacity-50">
              Here is sample description of what I am after.
            </p>
          </li>
        </ul>
        <ul className="flex flex-col gap-2 transition-all text-left text-opacity-50">
          <li>
            <h3 className="text-lg sm:text-xl text-black text-opacity-90 pb-2 uppercase">
              Office
            </h3>
          </li>
          <li>
            <p className="text-left text-md text-black text-opacity-50">
              1637 Burning Tree Dr. <br /> Thousand Oaks, CA 91362
            </p>
          </li>
          <li className="relative">
            {/* TODO: swap p tag for Link tag with mailto href */}
            <span
              className={cn(
                styles.transitionRightToLeftUnderline,
                "text-white"
              )}
            >
              <p className="text-left text-md cursor-pointer">
                email@email.com
              </p>
            </span>
          </li>
          <li>
            <p className="text-left text-md text-black text-opacity-50">
              (805) 279-4995
            </p>
          </li>
        </ul>
        <ul>
          <li>
            <h3 className="text-lg sm:text-xl text-black text-opacity-90 pb-2 uppercase">
              Links
            </h3>
            <ul className="flex flex-col gap-2 transition-all text-left text-md text-black text-opacity-50">
              <li className="relative">
                <span className={styles.transitionLeftToRightUnderline}>
                  <Link className="" href="/">
                    Home
                  </Link>
                </span>
              </li>
              <li className="relative">
                <span className={styles.transitionLeftToRightUnderline}>
                  <Link href="/masseuses">Masseuses</Link>
                </span>
              </li>
              <li className="relative">
                <span className={styles.transitionLeftToRightUnderline}>
                  <Link href="/about">About</Link>
                </span>
              </li>
              <li className="relative">
                <span className={styles.transitionLeftToRightUnderline}>
                  <Link href="/blog">Blog</Link>
                </span>
              </li>
              <li className="relative">
                <span className={styles.transitionLeftToRightUnderline}>
                  <Link href="/location">Location</Link>
                </span>
              </li>
            </ul>
          </li>
        </ul>
        <ul>
          <li>
            <h3 className="text-lg sm:text-xl text-black text-opacity-90 pb-2 uppercase">
              Get in Touch
            </h3>
          </li>
          <li>
            <Link
              className="text-left text-md text-black text-opacity-50 hover:text-white transition-all ease duration-500"
              href="/contact"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <SubFooter />
    </div>
  );
};

export default Footer;
