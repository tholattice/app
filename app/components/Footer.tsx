import Link from "next/link";

import { SocialIcon } from "react-social-icons";

const Footer = () => {
  const footerItems = [
    {
      name: "Terms and Conditions",
      slug: "terms-and-conditions",
    },
    {
      name: "Privacy Policy",
      slug: "privacy-policy",
    },
  ];

  return (
    <footer>
      <div className="flex flex-col items-center justify-between text-sm p-8 gap-2">
        <div className="text-center">
          &copy; {new Date().getFullYear()} Tholattice Digital Marketing LLC.
          All Rights Reserved.
        </div>
        <div className="flex justify-between items-center gap-4">
          <div>
            <nav>
              <ul className="flex justify-between text-center items-center gap-2">
                {footerItems.map(({ name, slug }) => (
                  <Link id={`nav-${slug}`} key={slug} href={`/${slug}`}>
                    <li className="transition-colors ease-out hover:text-black">
                      {name}
                    </li>
                  </Link>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex gap-2">
            <SocialIcon
              bgColor="#E0E0E0"
              fgColor="#707070"
              style={{ width: "30px", height: "30px" }}
              url="https://www.wechat.com"
            />
            <SocialIcon
              bgColor="#E0E0E0"
              fgColor="#707070"
              style={{ width: "30px", height: "30px" }}
              url="https://www.instagram.com"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
