import { unstable_cache } from "next/cache";
// import { serialize } from "next-mdx-remote/serialize";

import { prisma } from "@/lib/prisma";
// import { replaceExamples, replaceTweets } from "@/lib/remark-plugins";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      try {
        const data = await prisma.site.findUnique({
          where: subdomain ? { subdomain } : { customDomain: domain },
          include: {
            user: true,
            location: true,
            posts: {
              where: { published: true },
              orderBy: { createdAt: 'desc' },
              take: 5
            },
          },
        });

        if (!data) {
          // Return default site data for development/testing
          return {
            id: 'default',
            name: 'Sample Massage Business',
            description: 'Professional massage therapy services',
            logo: null,
            font: 'font-cal',
            layout: 1,
            image: null,
            imageBlurhash: null,
            subdomain: subdomain || 'sample',
            customDomain: domain,
            message404: "You've found a page that doesn't exist.",
            createdAt: new Date(),
            updatedAt: new Date(),
            locationId: 'default-location',
            userId: null,
            user: null,
            location: {
              id: 'default-location',
              name: 'Main Location',
              address: '123 Main St',
              city: 'City',
              state: 'State',
              postalCode: '12345',
              country: 'USA',
              latitude: null,
              longitude: null,
              phoneNumber: '(555) 123-4567',
              ownerId: 'default-owner',
            },
            posts: []
          };
        }

        return data;
      } catch (error) {
        console.error('Error fetching site data:', error);
        return null;
      }
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      try {
        const data = await prisma.post.findMany({
          where: {
            site: subdomain ? { subdomain } : { customDomain: domain },
            published: true,
          },
          select: {
            title: true,
            description: true,
            slug: true,
            image: true,
            imageBlurhash: true,
            createdAt: true,
          },
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
        });

        return data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
    },
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    },
  )();
}

export async function getPostData(domain: string, slug: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      // Temporarily disable database queries
      // const data = await prisma.post.findFirst({
      //   where: {
      //     site: subdomain ? { subdomain } : { customDomain: domain },
      //     slug,
      //     published: true,
      //   },
      //   include: {
      //     site: {
      //       include: {
      //         user: true,
      //       },
      //     },
      //   },
      // });

      // if (!data) return null;

    //   const [mdxSource, adjacentPosts] = await Promise.all([
    //     getMdxSource(data.content!),
    //     prisma.post.findMany({
    //       where: {
    //         site: subdomain ? { subdomain } : { customDomain: domain },
    //         published: true,
    //         NOT: {
    //           id: data.id,
    //         },
    //       },
    //       select: {
    //         slug: true,
    //         title: true,
    //         createdAt: true,
    //         description: true,
    //         image: true,
    //         imageBlurhash: true,
    //       },
    //     }),
    //   ]);

      // return {
      //   ...data,
      //   // mdxSource,
      //   // adjacentPosts,
      // };
      
      // Return null for now
      return null;
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}

// async function getMdxSource(postContents: string) {
//   // transforms links like <link> to [link](link) as MDX doesn't support <link> syntax
//   // https://mdxjs.com/docs/what-is-mdx/#markdown
//   const content =
//     postContents?.replaceAll(/<(https?:\/\/\S+)>/g, "[$1]($1)") ?? "";
//   // Serialize the content string into MDX
//   const mdxSource = await serialize(content, {
//     mdxOptions: {
//       remarkPlugins: [replaceTweets, () => replaceExamples(prisma)],
//     },
//   });

//   return mdxSource;
// }