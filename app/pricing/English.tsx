import Image from "next/image";

import { PLANS } from "@/lib/stripe/utils";

import { SimpleTooltipContent } from "@/app/components/Tooltip";
import { IPricingItems } from "@/lib/types/pricing";

export const EnglishPricingHeadline = () => {
  return (
    <div className="mx-auto mb-10 sm:max-w-lg">
      <h1 className="font-display text-4xl font-extrabold text-black sm:text-5xl">
        Clear and <span className="lifeGradientText">high-quality</span> pricing
      </h1>
      <p className="mt-5 text-gray-600 sm:text-lg">
        No hidden fees. Cancel anytime for free after a 3-month minimum
        commitment
      </p>
    </div>
  );
};

export const PricingItemsEnglish: Array<IPricingItems> = [
  {
    plan: "Essentials",
    tagline: "For small stores that need a strong digital presence",
    activeMasseuses: 5,
    features: [
      {
        text: "Beautiful, Mobile-Friendly Website (5+ Templates)",
        subText: [
          {
            subContent: "Real-Time Customer Appointment Scheduling Widget",
            subFootnote: (
              <SimpleTooltipContent
                title="Customers Can Only Select Next Available Masseuse on Essentials, but Preference-Based, Round-Robin Routing Available on Professional+ Plans."
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "Masseuse Carousel Gallery",
            subFootnote: (
              <SimpleTooltipContent
                // title="Display Active Masseuses in Real-Time on Your Website using AI-Generated Imagery ($50 One-Time Fee Add-On for Essentials Plan, Included in Professional+ Plans."
                title="Display Active Masseuses in Real-Time on Your Website Using AI-Generated Imagery. Includes 5 Avatar Profiles. Each Additional Avatar is $25."
                cta="Learn more."
                href="/blog/masseuse-carousel"
              />
            ),
            // subNeutral: true,
          },
          {
            subContent:
              "Chatbot Conversation AI -- Appointment Scheduling/FAQ Handling",
            // subNegative: true,
          },
          {
            subContent:
              "Customers Automatically Sent SMS Appointment Reminders",
            subFootnote: (
              <SimpleTooltipContent
                title="For Appointments Scheduled More than One Day in Advance"
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
            subNegative: true,
          },
          {
            subContent: "Customers Can Pay for Appointments Online",
            subNegative: true,
          },
          {
            subContent: "Enhanced Web Analytics",
            subFootnote: (
              <SimpleTooltipContent
                title="See Which Content Your Customers Engaged with the Most"
                cta="Learn more."
                href="/blog/enhanced-web-analytics"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "Natively-Written, High-Quality Blog Posts (Images, Videos) 5+ Per Week",
            subFootnote: (
              <SimpleTooltipContent
                title="Also Published on All Social Media Channels Linked to Your Subscription Plan"
                cta="Learn more."
                href="/blog/blog-posts"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "Web and Mobile Massage Therapy Management App",
        subText: [
          {
            subContent: "Handle Incoming Appointment Requests in Real-Time",
            subFootnote: (
              <SimpleTooltipContent
                title="Notifies All Masseuses of Incoming Request, both on App and WeChat Group Chat"
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "Generate AI Avatar Pictures for Masseuses",
            subFootnote: (
              <SimpleTooltipContent
                title="Based on Masseuse Uploads or Randomly Generated. Uploads Automatically to Website and Masseuse Carousel. 5 Masseuse Avatars Included in Essentials. 10 Included in Professional, and 20 Included in Premium."
                cta="Learn more."
                href="/blog/ai-generated-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent:
              "Missed-Call Textbacks and Conversational AI -- FAQ Handling",
            subFootnote: (
              <SimpleTooltipContent
                title="Receive a 10-digit Virtual Phone NUmber with Your Business's Local Area Code."
                cta="Learn more."
                href="/blog/virtual-phone-numbers"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "Get Notified of Customer Reviews from Private Communities and Niche Forums",
            subFootnote: (
              <SimpleTooltipContent
                title="Customers Like to Form Communities Around Massage Parlors They Enjoyed Visiting. See More Info on How Tholattice Keeps You Updated on Your Reputation Within These Communities"
                cta="Learn more."
                href="/blog/private-communities-reputation"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "Share Content Created by Your Business on Chinese Social Media (WeChat and WeiBo)",
            subNegative: true,
          },
          {
            subContent: "Create Custom Logos for Your Business (AI-Generated)",
            subFootnote: (
              <SimpleTooltipContent
                title="Receive Digital Copies of Adobe Photoshop and Illustrator via WeChat/Email. Useful for Flyers/Signage/Business Cards."
                cta="Learn more."
                href="/blog/custom-logo-creation"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "Custom Email Campaigns to Customers to Notify of New Specials or Masseuses",
            subFootnote: (
              <SimpleTooltipContent
                title="Also Includes Follow-Up Email Sequences Offered as AI Chatbot to Assist With Appointment Scheduling and FAQ Handling"
                cta="Learn more."
                href="/blog/email-campaigns"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "Social Media Reputation Management",
        subText: [
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Google My Business, Yelp</p>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/GMB-Logo.png"
                    width={25}
                    height={25}
                    alt="Google My Business Logo"
                  />
                </div>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/Yelp-Logo.png"
                    width={25}
                    height={25}
                    alt="Yelp Logo"
                  />
                </div>
              </div>
            ),
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Facebook</p>
                <div>
                  <Image
                    src="/Facebook-Logo.svg"
                    width={25}
                    height={25}
                    alt="Facebook Logo"
                  />
                </div>
              </div>
            ),
            subNegative: true,
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Instagram</p>
                <div>
                  <Image
                    src="/Instagram-Logo.svg"
                    width={25}
                    height={25}
                    alt="Instagram Logo"
                  />
                </div>
              </div>
            ),
            subNegative: true,
          },
          {
            subContent:
              "Receive and Handle All Incoming Appointment Requests in Web/Mobile App",
          },
          {
            subContent:
              "Dispute Unfair or Inaccurate Customer Reviews in Mandarin",
            subFootnote: (
              <SimpleTooltipContent
                title="AI-Generated Auto Suggestions Provided by Web/Mobile App in Professional+ Plans. All Customer Reviews Manually Reviewed by Native English Speakers from Tholattice Customer Support in Premium Plan."
                cta="Learn more."
                href="/blog/dispute-customer-reviews"
              />
            ),
          },
          {
            subContent:
              "Upload/Generate Photos of Location (Exterior/Interior) and Masseuses and Schedule Posts",
            subFootnote: (
              <SimpleTooltipContent
                title="Ability to Upload All images of Location and Manually Uploaded Photos to App. Publishing and Scheduling All Generated Imagery Only Available on Professional+ Plans"
                cta="Learn more."
                href="/blog/social-media-content"
              />
            ),
            subNeutral: true,
          },
          {
            subContent:
              "Customer Reviews Reviewed by Native English Speaker and Responded to On Your Behalf",
            subNegative: true,
          },
        ],
        footnote: (
          <SimpleTooltipContent
            title="Tholattice Publishes Content Regularly to These Social Media Channels on Your Behalf. Accessible through Web/Mobile App."
            cta="Learn more."
            href="/blog/social-media-content"
          />
        ),
      },
      {
        text: "Update, Maintain Consistent Business Information Across 50+ Online Directories",
        footnote: (
          <SimpleTooltipContent
            title="Feature Immediately Boosts SEO Visibility to Your Website. $100 One-Time Add-On Fee for Essentials Members, $50 Add-On Fee for Professional Members, and Free for Premium Members"
            cta="Learn more."
            href="/blog/online-directories-seo"
          />
        ),
        neutral: true,
      },
    ],
    cta: "Get started",
  },
  {
    plan: "Professional",
    tagline: "For most shops that need a well-rounded solution",
    activeMasseuses: PLANS.find((p) => p.slug === "professional")!
      .activeMasseuses,
    features: [
      {
        text: "Beautiful, Mobile-Friendly Website (5+ Templates)",
        subText: [
          {
            subContent: "Real-Time Customer Appointment Scheduling Widget",
            subFootnote: (
              <SimpleTooltipContent
                title="Customers Can Only Select Next Available Masseuse on Essentials, but Preference-Based, Round-Robin Routing Available on Professional+ Plans."
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "Masseuse Carousel Gallery",
            subFootnote: (
              <SimpleTooltipContent
                title="Display Active Masseuses in Real-Time on Your Website Using AI-Generated Imagery. Includes 5 Avatar Profiles. Each Additional Avatar is $25."
                cta="Learn more."
                href="/blog/masseuse-carousel"
              />
            ),
            subNeutral: false,
          },
          {
            subContent:
              "Chatbot Conversation AI -- Appointment Scheduling/FAQ Handling",
            subNegative: false,
          },
          {
            subContent:
              "Customers Automatically Sent SMS Appointment Reminders",
            subFootnote: (
              <SimpleTooltipContent
                title="For Appointments Scheduled More than One Day in Advance"
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "Customers Can Pay for Appointments Online",
            subNegative: true,
          },
          {
            subContent: "Enhanced Web Analytics",
            subFootnote: (
              <SimpleTooltipContent
                title="See Which Content Your Customers Engaged with the Most"
                cta="Learn more."
                href="/blog/enhanced-web-analytics"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "Natively-Written, High-Quality Blog Posts (Images, Videos) 5+ Per Week",
            subFootnote: (
              <SimpleTooltipContent
                title="Also Published on All Social Media Channels Linked to Your Subscription Plan"
                cta="Learn more."
                href="/blog/blog-posts"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "Web and Mobile Massage Therapy Management App",
        subText: [
          {
            subContent: "Handle Incoming Appointment Requests in Real-Time",
            subFootnote: (
              <SimpleTooltipContent
                title="Notifies All Masseuses of Incoming Request, both on App and WeChat Group Chat"
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "Generate AI Avatar Pictures for Masseuses",
            subFootnote: (
              <SimpleTooltipContent
                title="Based on Masseuse Uploads or Randomly Generated. Uploads Automatically to Website and Masseuse Carousel. 5 Masseuse Avatars Included in Essentials. 10 Included in Professional, and 20 Included in Premium."
                cta="Learn more."
                href="/blog/ai-generated-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent:
              "Missed-Call Textbacks and Conversational AI -- FAQ Handling",
            subFootnote: (
              <SimpleTooltipContent
                title="Receive a 10-digit Virtual Phone NUmber with Your Business's Local Area Code."
                cta="Learn more."
                href="/blog/virtual-phone-numbers"
              />
            ),
            subNegative: false,
          },
          {
            subContent:
              "Get Notified of Customer Reviews from Private Communities and Niche Forums",
            subFootnote: (
              <SimpleTooltipContent
                title="Customers Like to Form Communities Around Massage Parlors They Enjoyed Visiting. See More Info on How Tholattice Keeps You Updated on Your Reputation Within These Communities"
                cta="Learn more."
                href="/blog/private-communities-reputation"
              />
            ),
            subNegative: false,
          },
          {
            subContent:
              "Share Content Created by Your Business on Chinese Social Media (WeChat and WeiBo)",
            subNegative: true,
          },
          {
            subContent: "Create Custom Logos for Your Business (AI-Generated)",
            subFootnote: (
              <SimpleTooltipContent
                title="Receive Digital Copies of Adobe Photoshop and Illustrator via WeChat/Email. Useful for Flyers/Signage/Business Cards."
                cta="Learn more."
                href="/blog/custom-logo-creation"
              />
            ),
            subNegative: true,
          },
          {
            subContent:
              "Custom Email Campaigns to Customers to Notify of New Specials or Masseuses",
            subFootnote: (
              <SimpleTooltipContent
                title="Also Includes Follow-Up Email Sequences Offered as AI Chatbot to Assist With Appointment Scheduling and FAQ Handling"
                cta="Learn more."
                href="/blog/email-campaigns"
              />
            ),
            subNegative: true,
          },
        ],
      },
      {
        text: "Social Media Reputation Management",
        subText: [
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Google My Business, Yelp</p>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/GMB-Logo.png"
                    width={25}
                    height={25}
                    alt="Google My Business Logo"
                  />
                </div>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/Yelp-Logo.png"
                    width={25}
                    height={25}
                    alt="Yelp Logo"
                  />
                </div>
              </div>
            ),
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Facebook</p>
                <div>
                  <Image
                    src="/Facebook-Logo.svg"
                    width={25}
                    height={25}
                    alt="Facebook Logo"
                  />
                </div>
              </div>
            ),
            subNegative: false,
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Instagram</p>
                <div>
                  <Image
                    src="/Instagram-Logo.svg"
                    width={25}
                    height={25}
                    alt="Instagram Logo"
                  />
                </div>
              </div>
            ),
            subNegative: true,
          },
          {
            subContent:
              "Receive and Handle All Incoming Appointment Requests in Web/Mobile App",
          },
          {
            subContent:
              "Dispute Unfair or Inaccurate Customer Reviews in Mandarin",
            subFootnote: (
              <SimpleTooltipContent
                title="AI-Generated Auto Suggestions Provided by Web/Mobile App in Professional+ Plans. All Customer Reviews Manually Reviewed by Native English Speakers from Tholattice Customer Support in Premium Plan."
                cta="Learn more."
                href="/blog/dispute-customer-reviews"
              />
            ),
          },
          {
            subContent:
              "Upload/Generate Photos of Location (Exterior/Interior) and Masseuses and Schedule Posts",
            subFootnote: (
              <SimpleTooltipContent
                title="Ability to Generate Imagery for Social Media Content Only Available on Professional+ Plans"
                cta="Learn more."
                href="/blog/social-media-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent:
              "Customer Reviews Reviewed by Native English Speaker and Responded to On Your Behalf",
            subNegative: true,
          },
        ],
        footnote: (
          <SimpleTooltipContent
            title="Tholattice Publishes Content Regularly to These Social Media Channels on Your Behalf. Accessible through Web/Mobile App."
            cta="Learn more."
            href="/blog/social-media-content"
          />
        ),
      },
      {
        text: "Update, Maintain Consistent Business Information Across 50+ Online Directories",
        footnote: (
          <SimpleTooltipContent
            title="Feature Immediately Boosts SEO Visibility to Your Website. $100 One-Time Add-On Fee for Essentials Members, $50 Add-On Fee for Professional Members, and Free for Premium Members"
            cta="Learn more."
            href="/blog/online-directories-seo"
          />
        ),
        neutral: true,
      },
    ],
    cta: "Get started",
  },
  {
    plan: "Premium",
    tagline:
      "For larger stores with good branding in need of advanced features",
    activeMasseuses: PLANS.find((p) => p.slug === "premium")!.activeMasseuses,
    features: [
      {
        text: "Beautiful, Mobile-Friendly Website (5+ Templates)",
        subText: [
          {
            subContent: "Real-Time Customer Appointment Scheduling Widget",
            subFootnote: (
              <SimpleTooltipContent
                title="Customers Can Only Select Next Available Masseuse on Essentials, but Preference-Based, Round-Robin Routing Available on Professional+ Plans."
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "Masseuse Carousel Gallery",
            subFootnote: (
              <SimpleTooltipContent
                title="Display Active Masseuses in Real-Time on Your Website Using AI-Generated Imagery. Includes 5 Avatar Profiles. Each Additional Avatar is $25."
                cta="Learn more."
                href="/blog/masseuse-carousel"
              />
            ),
            subNeutral: false,
          },
          {
            subContent:
              "Chatbot Conversation AI -- Appointment Scheduling/FAQ Handling",
            subNegative: false,
          },
          {
            subContent:
              "Customers Automatically Sent SMS Appointment Reminders",
            subFootnote: (
              <SimpleTooltipContent
                title="For Appointments Scheduled More than One Day in Advance"
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
            subNegative: false,
          },
          {
            subContent: "Customers Can Pay for Appointments Online",
            subNegative: false,
          },
          {
            subContent: "Enhanced Web Analytics",
            subFootnote: (
              <SimpleTooltipContent
                title="See Which Content Your Customers Engaged with the Most"
                cta="Learn more."
                href="/blog/enhanced-web-analytics"
              />
            ),
            subNegative: false,
          },
          {
            subContent:
              "Natively-Written, High-Quality Blog Posts (Images, Videos) 5+ Per Week",
            subFootnote: (
              <SimpleTooltipContent
                title="Also Published on All Social Media Channels Linked to Your Subscription Plan"
                cta="Learn more."
                href="/blog/blog-posts"
              />
            ),
            subNegative: false,
          },
        ],
      },
      {
        text: "Web and Mobile Massage Therapy Management App",
        subText: [
          {
            subContent: "Handle Incoming Appointment Requests in Real-Time",
            subFootnote: (
              <SimpleTooltipContent
                title="Notifies All Masseuses of Incoming Request, both on App and WeChat Group Chat"
                cta="Learn more."
                href="/blog/appointment-scheduling"
              />
            ),
          },
          {
            subContent: "Generate AI Avatar Pictures for Masseuses",
            subFootnote: (
              <SimpleTooltipContent
                title="Based on Masseuse Uploads or Randomly Generated. Uploads Automatically to Website and Masseuse Carousel. 5 Masseuse Avatars Included in Essentials. 10 Included in Professional, and 20 Included in Premium."
                cta="Learn more."
                href="/blog/ai-generated-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent:
              "Missed-Call Textbacks and Conversational AI -- FAQ Handling",
            subFootnote: (
              <SimpleTooltipContent
                title="Receive a 10-digit Virtual Phone NUmber with Your Business's Local Area Code."
                cta="Learn more."
                href="/blog/virtual-phone-numbers"
              />
            ),
            subNegative: false,
          },
          {
            subContent:
              "Get Notified of Customer Reviews from Private Communities and Niche Forums",
            subFootnote: (
              <SimpleTooltipContent
                title="Customers Like to Form Communities Around Massage Parlors They Enjoyed Visiting. See More Info on How Tholattice Keeps You Updated on Your Reputation Within These Communities"
                cta="Learn more."
                href="/blog/private-communities-reputation"
              />
            ),
            subNegative: false,
          },
          {
            subContent:
              "Share Content Created by Your Business on Chinese Social Media (WeChat and WeiBo)",
            subNegative: false,
          },
          {
            subContent: "Create Custom Logos for Your Business (AI-Generated)",
            subFootnote: (
              <SimpleTooltipContent
                title="Receive Digital Copies of Adobe Photoshop and Illustrator via WeChat/Email. Useful for Flyers/Signage/Business Cards."
                cta="Learn more."
                href="/blog/custom-logo-creation"
              />
            ),
            subNegative: false,
          },
          {
            subContent:
              "Custom Email Campaigns to Customers to Notify of New Specials or Masseuses",
            subFootnote: (
              <SimpleTooltipContent
                title="Also Includes Follow-Up Email Sequences Offered as AI Chatbot to Assist With Appointment Scheduling and FAQ Handling"
                cta="Learn more."
                href="/blog/email-campaigns"
              />
            ),
            subNegative: false,
          },
        ],
      },
      {
        text: "Social Media Reputation Management",
        subText: [
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Google My Business, Yelp</p>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/GMB-Logo.png"
                    width={25}
                    height={25}
                    alt="Google My Business Logo"
                  />
                </div>
                <div>
                  <Image
                    className="flex-shrink-0"
                    src="/Yelp-Logo.png"
                    width={25}
                    height={25}
                    alt="Yelp Logo"
                  />
                </div>
              </div>
            ),
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Facebook</p>
                <div>
                  <Image
                    src="/Facebook-Logo.svg"
                    width={25}
                    height={25}
                    alt="Facebook Logo"
                  />
                </div>
              </div>
            ),
            subNegative: false,
          },
          {
            subContent: (
              <div className="flex flex-row flex-wrap justify-start items-center gap-2">
                <p>Instagram</p>
                <div>
                  <Image
                    src="/Instagram-Logo.svg"
                    width={25}
                    height={25}
                    alt="Instagram Logo"
                  />
                </div>
              </div>
            ),
            subNegative: false,
          },
          {
            subContent:
              "Receive and Handle All Incoming Appointment Requests in Web/Mobile App",
          },
          {
            subContent:
              "Dispute Unfair or Inaccurate Customer Reviews in Mandarin",
            subFootnote: (
              <SimpleTooltipContent
                title="AI-Generated Auto Suggestions Provided by Web/Mobile App in Professional+ Plans. All Customer Reviews Manually Reviewed by Native English Speakers from Tholattice Customer Support in Premium Plan."
                cta="Learn more."
                href="/blog/dispute-customer-reviews"
              />
            ),
          },
          {
            subContent:
              "Upload/Generate Photos of Location (Exterior/Interior) and Masseuses and Schedule Posts",
            subFootnote: (
              <SimpleTooltipContent
                title="Ability to Generate Imagery for Social Media Content Only Available on Professional+ Plans"
                cta="Learn more."
                href="/blog/social-media-content"
              />
            ),
            subNeutral: false,
          },
          {
            subContent:
              "Customer Reviews Reviewed by Native English Speaker and Responded to On Your Behalf",
            subNegative: false,
          },
        ],
        footnote: (
          <SimpleTooltipContent
            title="Tholattice Publishes Content Regularly to These Social Media Channels on Your Behalf. Accessible through Web/Mobile App."
            cta="Learn more."
            href="/blog/social-media-content"
          />
        ),
      },
      {
        text: "Update, Maintain Consistent Business Information Across 50+ Online Directories",
        footnote: (
          <SimpleTooltipContent
            title="Feature Immediately Boosts SEO Visibility to Your Website. $100 One-Time Add-On Fee for Essentials Members, $50 Add-On Fee for Professional Members, and Free for Premium Members"
            cta="Learn more."
            href="/blog/online-directories-seo"
          />
        ),
        neutral: false,
      },
    ],
    cta: "Get started",
  },
];
