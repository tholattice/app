import { Metadata } from 'next';
import { customAlphabet } from 'nanoid'

import { HOME_DOMAIN } from './constants';

export const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7,
  ); // 7-character random string

  export function constructMetadata({
    title = "Tholattice Digital Marketing - full-service marketing solution for Asian massage therapists",
    description = "Tholattice is a full-service marketing software solution for Asian massage therapists who want a quality, professional digital presence",
    image = "https://tholattice.com/_static/TholatticeSymbolWhiteBG.png",
    icons = "/icon.ico",
    noIndex = false,
  }: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
  } = {}): Metadata {
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
          },
        ],
      },
      // twitter: {
      //   card: "summary_large_image",
      //   title,
      //   description,
      //   images: [image],
      //   creator: "@dubdotco",
      // },
      icons,
      metadataBase: new URL(HOME_DOMAIN),
      ...(noIndex && {
        robots: {
          index: false,
          follow: false,
        },
      }),
    };
  }