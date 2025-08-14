import { ReactNode } from "react";

import { Metadata } from "next";
// import Image from "next/image";
// import Link from "next/link";
import { notFound, redirect } from "next/navigation";
// import CTA from "@/components/cta";
// import ReportAbuse from "@/components/report-abuse";

import { getSiteData } from "@/lib/fetchers";
// import { fontMapper } from "@/styles/fonts/fonts";
import { layoutMapper } from "@/styles/layouts/layouts";
import { fontMapper } from "@/styles/fonts/fonts";
import Providers from "./providers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata | null> {
  const { domain: domainParam } = await params;
  const domain = decodeURIComponent(domainParam);
  const data = await getSiteData(domain);

  if (!data) {
    return null;
  }
  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string;
    description: string;
    image: string;
    logo: string;
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    icons: [logo],
    // Note: The logo should be different from the favicon
    metadataBase: new URL(`https://${domain}`),
    // Optional: Set canonical URL to custom domain if it exists
    ...(domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
      data.customDomain && {
        alternates: {
          canonical: `https://${data.customDomain}`,
        },
      }),
  };
}

export default async function TenantSiteLayout({
  params,
  children,
}: {
  params: Promise<{ domain: string }>;
  children: ReactNode;
}) {
  const { domain: domainParam } = await params;
  const domain = decodeURIComponent(domainParam);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  // Optional: Redirect to custom domain if it exists
  // Note: Consider using rewrite instead of custom domain to avoid double redirects enter into an infinite loop. Not sure about this. Comment this out for now.
  // if (
  //   domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
  //   data.customDomain &&
  //   process.env.REDIRECT_TO_CUSTOM_DOMAIN_IF_EXISTS === "true"
  // ) {
  //   return redirect(`https://${data.customDomain}`);
  // }

  return (
    <html>
      <body className={fontMapper[data.font]}>
        <Providers>{layoutMapper({ children, data })[data.layout]}</Providers>
      </body>
    </html>
  );
}
