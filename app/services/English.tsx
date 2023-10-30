import Image from "next/image";
import Link from "next/link";

import SocialMediaLogos from "../components/SocialMediaLogos";

export const EnglishWebsiteCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        5 Fast, Beautiful, Mobile-First, SEO-Optimized, and ADA-Compliant
        Websites to Choose From
      </h3>
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">Mobile-First</b>: Reach out to your customers
          easily with a mobile-friendly website. Our website templates have been
          carefully designed and tested to fit all modern smartphones and be
          responsive to touch. All widgets, including our appointment scheduling
          functionalities, are also sized to be mobile-ready. Give your
          customers a convenient experience with a mobile-friendly website.
        </li>
        <br />
        <li>
          <b className="font-bold">SEO-Optimized</b>: Make your website easy for
          Google, Bing, and other search engines to understand your website and
          serve them to customers who search for your business in the local
          area. All of the pages on our websites are checked and constantly
          scanned to be secure against well-known security vulnerabilities (e.g.
          DDOS attacks, SQL injections, etc.). SSL certificates are always
          updated, and canonical URLs are used to keep search engines from
          confusing duplicate or similar content across multiple URLs. Having a
          website that is SEO-optimized allows search engines and customers to
          find your business more easily.
        </li>
        <br />
        <li>
          <b className="font-bold">Fast</b>: Good SEO also involves always
          making sure that our webpages load as fast as possible upon the
          initial visit by your customers, which is why our server-side rendered
          websites are designed to load as fast as possible. With the latest
          cutting-edge technology, all of our websites are hosted on the
          &quot;edge&quot;, meaning that our websites are hosted close to your
          customer and served in the fastest way possible. With a fast website
          from Tholattice, you can rest assured that customers will stay on your
          website and interact with it more fully.
        </li>
        <br />
        <li>
          <b className="font-bold">Beautiful</b>: Customers like feeling that
          they are being served in an artful manner. Therefore, all of our
          website templates are crafted to be modern and lightweight, with
          beautiful carousels and animations where they are most fitting. For
          each logo you create or upload through our app, we carefully balance
          all color schemes to be most aesthetically pleasing to the eye.
        </li>
        <br />
        <li>
          <b className="font-bold">Ease of Use for the Disabled</b>: In addition
          to being a legal mandate by the federal government to guarantee equal
          opportunity for disabled individuals in the public spheres of
          accommodation, it is always best to make your website feel welcome to
          all customers. We design our websites to follow{" "}
          <Link href="https://www.w3.org/WAI/WCAG2AA-Conformance">
            WCAG 2.0 AA Guidelines
          </Link>
          , so you can rest assured that those with disabilities feel cared for
          while visiting your website.
        </li>
        {/* <br />
    <li>
      <b className="font-bold">Customizable/Switchable</b>: Update your
      pricing and service offering in real-time through the Tholattice web
      and mobile app. Upload pictures and videos through our app, and have
      them appear in your own gallery carousel.
    </li>{" "}
    <br />
    <li>
      <b className="font-bold">Schedule Appointments</b>: *This should
      probably be in its own section along with the carousel feature. Also
      needs an illustration of the round-robin feature. Could be a blog
      post on its own* Choose from allowing your customers to schedule an
      appointment with the next available masseuse or preferred
      masseuse(s). If scheduling more than one day in advance, remind your
      customers on the day of the appointment via SMS--with their express
      opt-in consent. Can select couples massage and make online payment.
      Ability to cancel/reschedule within 30 minutes to 1 hour of the
      scheduled appointment.
    </li> */}
      </ul>
    </>
  );
};

export const EnglishAppointmentScheduleCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        Allow Your Customers to Schedule Appointments on Your Website
      </h3>
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">Real-Time Appointment Handling</b>: From the
          convenience of the Tholattice mobile and web app, handle incoming
          appointment requests in real-time from your website and various social
          media channels. You can view the entire history of scheduled
          appointments, cancel, reschedule, or delegate appointments to your
          masseuses. You can also prevent customers from scheduling appointments
          by blacklisting or shadowbanning their phone numbers and email
          addresses.
        </li>
        <br />
        <li>
          <b className="font-bold">Round-Robin Appointment Routing</b>: Allow
          Tholattice to route incoming appointment requests based on the next
          available masseuse or by a list of preferred masseuses selected by the
          customer. If a customer selects to be served by the next available
          masseuse, admins can allow Tholattice to route appointments to the
          next available masseuse with the least number of customers for the day
          or indiscriminately to whichever masseuse happens to be available
          (Greedy vs. Equal Routing Distribution) Incoming appointments can also
          be handled by linking the Tholattice mobile app to a WeChat group chat
          and confirming the appointment that way. Once confirmed or denied,
          customers can also be notified via SMS. Please visit our blog post for
          more details on our proprietary appointment scheduling technology.
        </li>
      </ul>
    </>
  );
};

export const EnglishSMSCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        Send SMS Texts to Your Customers to Remind Them of Future Appointments
        and New Deals or Masseuses
      </h3>
      <Image
        className="opacity-90"
        src="/SMS-Text-Phone.png"
        width={750}
        height={750}
        alt="Website Showcase on Desktop and Mobile Devices"
      />
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">Appointment Reminders</b>: If your customers
          have scheduled appointments greater than 1 day in advance. Remind your
          customers and confirm if they will visit you that day. Also, allow
          your customers to cancel or reschedule appointments via SMS and get
          re-entered into the round-robin queue. This will allow you and your
          masseuses to focus on providing a quality experience to your current
          customers rather than scheduling appointments.
        </li>
        <br />
        <li>
          <b className="font-bold">Missed-Call Textback</b>: Automatically text
          back your customers in case you miss a call from them. This will allow
          you to never miss a customer&quot;s request for a massage during busy
          times. Tholattice will handle appointment scheduling while you are
          away. Please see our blog post on missed call textbacks for more
          details.
        </li>
        <br />
        <li>
          <b className="font-bold">Consent and Opt-In Management</b>: Laws and
          regulations surrounding texting customers are very strict. Tholattice
          complies with all regulations issued by the Telephone Consumer
          Protection Act (TCPA), Federal Communications Commission (FCC), and
          all California regulatory bodies involved with SMS telemarketing,
          including the California Consumer Privacy Act (CCPA) in order to
          ensure that all communications with your customers are safely sent and
          legal.
        </li>
      </ul>
    </>
  );
};

export const EnglishSocialMediaCopy = () => {
  return (
    <>
      <h3 className="text-2xl text-center pb-4">
        Expand and Manage Your Reach with Social Media
      </h3>
      <SocialMediaLogos />
      <ul className="list-disc pl-8">
        <li>
          <b className="font-bold">Greater Local Awareness</b>: Leverage various
          social media algorithms to expand your business to relevant customers
          within your area. Tholattice helps you do this by allowing you to
          connect or create social media profiles with our web and mobile apps.
          Upload, generate, and publish content to these social media channels
          seamlessly.
        </li>
        <br />
        <li>
          <b className="font-bold">Consolidate Management in a Single Place</b>:
          Avoid having to update store hours and holidays on multiple websites.
          With Tholattice, you can do this all in our web and mobile app.
          Tholattice will also help to remind you to update hours and to update
          inconsistent listings or store information across your various social
          media channels.
        </li>
        <br />
        <li>
          <b className="font-bold">Dispute Unfair Customer Reviews</b>: Bad
          customer reviews, especially those that accuse masseuses of engaging
          in illicit behavior, can destroy a business. With Tholattice, we
          automatically notify you of any bad reviews and allow you to dispute
          the reviews in your native language. We have native English speakers
          who will then review your claims to ensure the best possible chance of
          approval and forward them to your social media channels.
        </li>
        <br />
        <li>
          <b className="font-bold">Local Directories Updating (External SEO)</b>
          : While Tholattice always works to improve on-site SEO, we also work
          to improve website visibility through off-site methods. This involves
          making sure that all your business information is current and listed
          across all well-known local directories, including GMB, Bing, Apple
          Maps and 50+ other directories. When your business is listed on those
          directories, search engines will rank your website more favorably and
          will more be likely to show your website to more people who search for
          massages in their local area.
        </li>
        <br />
        <li>
          <b className="font-bold">
            Specialized Directories (Masseuse/Parlor Matching)
          </b>
          : There are some small, private directories and forums created by
          various communities that review massage parlors and independent
          masseuses. Be immediately informed of new updates across all of these
          directories and notified if customers mention a specific masseuse who
          works for your business. Tholattice will try its best to match
          masseuses by name to your location and notify you immediately.
        </li>
      </ul>
    </>
  );
};
