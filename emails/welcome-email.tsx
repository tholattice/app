import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import Footer from "./components/footer";

import { THOLATTICE_LOGO, THOLATTICE_THUMBNAIL } from "@/utils/constants";

export default function WelcomeEmail({
  name = "Alex Thompson",
  email = "alex@tholattice.com",
}: {
  name: string | null;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Tholattice</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={THOLATTICE_LOGO}
                width="40"
                height="40"
                alt="Tholattice"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold text-black">
              Welcome to Tholattice
            </Heading>
            <Section className="my-8">
              <Img
                src={THOLATTICE_THUMBNAIL}
                alt="Dub"
                className="max-w-[500px]"
              />
            </Section>
            <Text className="text-sm leading-6 text-black">
              Thanks for signing up{name && `, ${name}`}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              My name is Alex, and I'm the founder of Tholattice - a
              full-service marketing solution for Asian massage therapists
              seeking a quality, professional image. I'm excited to have you on
              board!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Here are a few things you can do:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Visit our blog for updates
              <Link
                href="https://tholattice.com/blog"
                className="font-medium text-blue-600 no-underline"
              >
                Tholattice Blog
              </Link>
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Visit your dashboard{" "}
              <Link
                href="https://app.tholattice.com"
                className="font-medium text-blue-600 no-underline"
              >
                Dashboard
              </Link>{" "}
              and customize your settings as needed.
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Follow us on{" "}
              <Link
                href="https://tholattice.com"
                className="font-medium text-blue-600 no-underline"
              >
                Tholattice Website
              </Link>
            </Text>
            <Text className="text-sm leading-6 text-black">
              Let me know if you have any questions or feedback. I'm always
              happy to help!
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              Alex from Tholattice
            </Text>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
