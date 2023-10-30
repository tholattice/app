import Link from "next/link";

export const EnglishIntrouction = () => {
  return (
    <p>
      Welcome to Tholattice Digital Marketing! This Privacy Policy outlines how
      Tholattice Digital Marketing LLC, located at 1637 Burning Tree Dr.,
      Thousand Oaks, CA 91362, United States (&quot;Tholattice Digital
      Marketing,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
      collects, uses, and protects personal information when you visit our
      website <Link href="/">https://www.tholattice.com</Link> (&quot;the
      Website&quot;) and use our web and mobile applications (collectively,
      &quot;the Services&quot;).
    </p>
  );
};

export const EnglishInformationCollected = () => {
  return (
    <>
      <p>We may collect the following types of personal information:</p>
      <br />
      <ul className="list-disc pl-8">
        <li>
          <b>Personal Identifiers</b>: Such as your first and last name, email
          address, phone number, and social media information retrieved from
          WeChat, Google, and Facebook.
        </li>
        <br />
        <li>
          <b>Usage Data</b>: Information related to how you interact with the
          Website and our Services, including IP address, device information,
          and browsing behavior.
        </li>
      </ul>
    </>
  );
};

export const EnglishDataRetention = () => {
  return (
    <p>
      Tholattice Digital Marketing LLC will retain all data inputted by users
      for a period of 30 days after cancellation. This data is stored in our
      third-party cloud database provider,{" "}
      <Link href="https://supabase.com/">Supabase Inc.</Link>, to provide
      inactive users the option to resubscribe to our services without impacting
      user experience. Inactive users can also fully use the free versions of
      our web and mobile apps. Inactive users have the ability to permanently
      delete all data associated with them by logging into{" "}
      <Link href="https://app.tholattice.com/settings/purge">
        https://app.tholattice.com/settings/purge
      </Link>{" "}
      and clicking through to purge all data.
    </p>
  );
};

export const EnglishHowWeUse = () => {
  return (
    <>
      <p>We use the information we collect for the following purposes:</p>
      <br />
      <ul className="list-disc pl-8">
        <li>To provide and improve our Services.</li>
        <br />
        <li>
          To communicate with you, respond to inquiries, and offer customer
          support.
        </li>
        <br />
        <li>To comply with legal and regulatory requirements.</li>
      </ul>
    </>
  );
};

export const EnglishSharingInformation = () => {
  return (
    <>
      <p>We may share your information with the following:</p>
      <br />
      <ul className="list-disc pl-8">
        <li>
          <b>Service Providers</b>: We may share data with third-party service
          providers to assist us in providing our Services. These providers are
          contractually bound to protect your data.
        </li>
        <br />
        <li>
          <b>Legal Authorities</b>: We may disclose information if required by
          law, regulation, or in response to a subpoena or court order.
        </li>
        <br />
        <li>
          <b>Third Parties</b>: With your consent, we may share your data with
          third parties for marketing and advertising purposes.
        </li>
      </ul>
    </>
  );
};

export const EnglishCookies = () => {
  return (
    <p>
      We may use cookies and similar technologies on the Website and in our
      Services. You can manage your cookie preferences by adjusting your browser
      settings.
    </p>
  );
};

export const English3rdParty = () => {
  return (
    <>
      <p>
        We use the following third-party services, each with its own privacy
        policy:
      </p>
      <br />
      <ul className="list-disc pl-8">
        <li>
          <b>Google Analytics</b>: We use Google Analytics to analyze user
          behavior on our Website. For more information, please review{" "}
          <Link href="https://policies.google.com/privacy">
            Google&apos;s Privacy Policy.
          </Link>
        </li>
        <br />
        <li>
          <b>Facebook Pixels</b>: We use Facebook Pixels for tracking and
          targeted advertising. Please review{" "}
          <Link href="https://www.facebook.com/policy.php">
            Facebook&apos;s Data Policy
          </Link>{" "}
          for more details.
        </li>
        <br />
        <li>
          <b>SMS Marketing (Twilio, Inc.)</b>: We use Twilio, Inc. for SMS
          marketing. Please review{" "}
          <Link href="https://www.twilio.com/legal/privacy">
            Twilio&apos;s Privacy Policy
          </Link>{" "}
          for more information.
        </li>
        <br />
        <li>
          <b>Email Marketing (SendGrid, Inc.)</b>: We use SendGrid, Inc. for
          email marketing. Review{" "}
          <Link href="https://sendgrid.com/policies/privacy/services-privacy-policy/">
            SendGrid&apos;s Privacy Policy
          </Link>
          for more information.
        </li>
      </ul>
    </>
  );
};

export const EnglishDataBreach = () => {
  return (
    <p>
      In the event of a data breach, we will immediately send an email within 24
      hours letting you know the extent of such a breach, what information if
      any has leaked, and the progress we are making to resolve the issue.
    </p>
  );
};

export const EnglishStripe = () => {
  return (
    <p>
      We use Stripe, Inc. for payment processing. Your payment card details are
      encrypted and processed by Stripe. Tholattice Digital Marketing does not
      store or access your payment card information. Please review{" "}
      <Link href="https://stripe.com/privacy">
        Stripe&apos;s Privacy Policy
      </Link>{" "}
      for more information.
    </p>
  );
};

export const EnglishRemarketing = () => {
  return (
    <p>
      We use remarketing services for marketing and advertising purposes. These
      services may display our ads on other websites. You can opt out of these
      services by adjusting your preferences on the web or mobile app.
    </p>
  );
};

export const EnglishAgeVerification = () => {
  return (
    <p>
      Tholattice Digital Marketing LLC does not collect data from children under
      the age of 13. An age verification check is implemented in order to ensure
      that the data of underage children is not being collected.
    </p>
  );
};

export const EnglishUpdatesToPP = () => {
  return (
    <p>
      Tholattice Digital Marketing LLC reserves the right to make any changes to
      this privacy policy at any time. Updates to this privacy policy will be
      sent via email.
    </p>
  );
};

export const EnglishRightsAndChoices = () => {
  return (
    <ul className="list-disc pl-8">
      <li>
        <b>Access and Deletion</b>: You may request access to and deletion of
        your personal information.
      </li>
      <br />
      <li>
        <b>Opt-Out</b>: You can opt out of marketing communications at any time
        by following the instructions provided in the communication.
      </li>
    </ul>
  );
};

export const EnglishContact = () => {
  return (
    <p>
      If you have any questions or concerns about our privacy practices, please
      contact us at alex@tholattice.com or visit our contact page at{" "}
      <Link href="/contact">https://www.tholattice.com/contact</Link>.
    </p>
  );
};
