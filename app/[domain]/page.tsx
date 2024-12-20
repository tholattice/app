// import Image from "next/image";
// import Link from "next/link";
import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { getPostsForSite, getSiteData } from "@/lib/fetchers";

import Hero from "@/styles/components/Hero";
import Services from "@/styles/components/Services";
import About from "@/styles/components/About";
import Filler from "@/styles/components/Filler";
import Gallery from "@/styles/components/Gallery";
import Testimonials from "@/styles/components/Testimonials";
import LowerCTA from "@/styles/components/LowerCTA";
import Contact from "@/styles/components/Contact";

export async function generateStaticParams() {
  const allSites = await prisma.site.findMany({
    select: {
      subdomain: true,
      customDomain: true,
    },
    // feel free to remove this filter if you want to generate paths for all sites
    // where: {
    //   subdomain: "demo",
    // },
  });

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean);

  return allPaths;
}

export default async function TenantHomePage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const [data, posts] = await Promise.all([
    getSiteData(domain),
    getPostsForSite(domain),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <Hero />
      <Services />
      <About />
      <Filler />
      <Gallery />
      <Testimonials />
      <LowerCTA />
      <Contact />
    </div>
  );

  // This is the subdomain: {data.subdomain}, and this is the{" "}
  //     {data.description}
}
