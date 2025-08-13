import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getPostData, getSiteData } from "@/lib/fetchers";
// import BlogCard from "@/components/blog-card";
// import BlurImage from "@/components/blur-image";
// import MDX from "@/components/mdx";
// import { placeholderBlurhash, toDateString } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain: domainParam, slug: slugParam } = await params;
  const domain = decodeURIComponent(domainParam);
  const slug = decodeURIComponent(slugParam);

  const [data, siteData] = await Promise.all([
    getPostData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return null;
  }
  const { title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@vercel",
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

// Disabled static generation to avoid database connection issues during build
// export async function generateStaticParams() {
//   const allPosts = await prisma.post.findMany({
//     select: {
//       slug: true,
//       site: {
//         select: {
//           subdomain: true,
//           customDomain: true,
//         },
//       },
//     },
//   });

//   const allPaths = allPosts
//     .flatMap(({ site, slug }) => [
//       site?.subdomain && {
//         domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//         slug,
//       },
//       site?.customDomain && {
//         domain: site.customDomain,
//         slug,
//       },
//     ])
//     .filter(Boolean);

//   return allPaths;
// }

export default async function TenantPostsPage({
  params,
}: {
  params: Promise<{ domain: string; slug: string }>;
}) {
  const { domain: domainParam, slug: slugParam } = await params;
  const domain = decodeURIComponent(domainParam);
  const slug = decodeURIComponent(slugParam);
  const data = await getPostData(domain, slug);

  console.log("here is the domain and slug", domain, slug);
  console.log("this is the data output", data);

  if (!data) {
    notFound();
  }

  // Type assertion to help TypeScript understand the data structure
  const postData = data as any;

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="m-auto w-full text-center md:w-7/12">
          {/* <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 dark:text-stone-400 md:text-base">
            {toDateString(data.createdAt)}
          </p> */}
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 dark:text-white md:text-6xl">
            {postData?.title || "Post Not Found"}
          </h1>
          <p className="text-md m-auto w-10/12 text-stone-600 dark:text-stone-400 md:text-lg">
            {postData?.description || "This post could not be found."}
          </p>
          <p className="text-md text-left md:text-lg">{postData?.content || "Content not available."}</p>
        </div>
      </div>
    </>
  );
}
