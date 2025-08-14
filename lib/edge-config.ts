// Note: Rate limiting implementation needed to prevent malicious users
import { get } from "@vercel/edge-config";
import { getDomainWithoutWWW } from "@/utils/misc";

export const isBlacklistedDomain = async (domain: string) => {
  let blacklistedDomains: string[] = [];
  let blacklistedTerms: string[] = [];

  try {
    const [domains, terms] = await Promise.all([
      get("domains"),
      get("terms"),
    ]);
    blacklistedDomains = (domains as string[]) || [];
    blacklistedTerms = (terms as string[]) || [];
  } catch (e) {
    blacklistedDomains = [];
    blacklistedTerms = [];
  }

  const domainToTest = getDomainWithoutWWW(domain) || domain;

  return (
    blacklistedDomains.includes(domainToTest) ||
    new RegExp(blacklistedTerms.join("|")).test(domainToTest)
  );
};

export const isBlacklistedReferrer = async (referrer: string | null) => {
  const hostname = referrer ? getDomainWithoutWWW(referrer) || referrer : "(direct)";
  let referrers: string[] = [];
  try {
    const refs = await get("referrers");
    referrers = (refs as string[]) || [];
  } catch (e) {
    referrers = [];
  }
  return !referrers.includes(hostname);
};

export const isBlacklistedKey = async (key: string) => {
  let blacklistedKeys: string[] = [];
  try {
    const keys = await get("keys");
    blacklistedKeys = (keys as string[]) || [];
  } catch (e) {
    blacklistedKeys = [];
  }
  return new RegExp(blacklistedKeys.join("|"), "i").test(key);
};

export const isWhitelistedEmail = async (email: string) => {
  let whitelistedEmails: string[] = [];
  try {
    const emails = await get("whitelist");
    whitelistedEmails = (emails as string[]) || [];
  } catch (e) {
    whitelistedEmails = [];
  }
  return whitelistedEmails.includes(email);
};

export const isBlacklistedEmail = async (email: string) => {
  let blacklistedEmails: string[] = [];
  try {
    const emails = await get("emails");
    blacklistedEmails = (emails as string[]) || [];
  } catch (e) {
    blacklistedEmails = [];
  }
  return new RegExp(blacklistedEmails.join("|"), "i").test(email);
};

export const isReservedKey = async (key: string) => {
  if (!process.env.EDGE_CONFIG) {
    // If EDGE_CONFIG is not set, these are the default reserved keys
    return [
      "blog",
      "help",
      "pricing",
      "changelog",
      "metatags",
      "terms",
      "privacy",
    ].includes(key);
  }
  let reservedKey: string[] = [];
  try {
    const reserved = await get("reserved");
    reservedKey = (reserved as string[]) || [];
  } catch (e) {
    reservedKey = [];
  }
  return reservedKey.includes(key);
};