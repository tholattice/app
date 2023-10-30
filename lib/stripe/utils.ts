export const PLANS = [
    {
        name: "每月必需品订阅 (Essentials Subscription)",
        slug: "essentials",
        activeMasseuses: 5,
        price: {
          monthly: {
            amount: 197,
            priceIds: {
              test: "price_1NxMDBEr0qgwGExZ6fGM73cn",
              production: "price_1NxMDBEr0qgwGExZ6fGM73cn",
              // Added the same product and test price ID's to this pricing plan. Not sure what impact this will have on my pricing page.
            },
          },
          yearly: {
           amount: 197*12*0.75,
        //    TODO: 20% discount. Try to find a way of referencing the monthly cost from the prior object in order to automate this yearly calculation
            priceIds: {
              test: "price_1NxMKBEr0qgwGExZ9QajnMVh",
              production: "price_1NxMKBEr0qgwGExZ9QajnMVh",
              // Not sure where these priving id's for annual plans come from
            },
          },
        },
      },
    {
      name: "专业订阅 (Professional Subscription)",
      slug: "professional",
      activeMasseuses: 10,
      price: {
        monthly: {
          amount: 397,
          priceIds: {
            test: "price_1NxMXpEr0qgwGExZKwZMOnKn",
            production: "price_1NxMXpEr0qgwGExZKwZMOnKn",
          },
        },
        yearly: {
          amount: 397*12*0.75,
          priceIds: {
            test: "price_1NxMXpEr0qgwGExZRhRxzZTS",
            production: "price_1NxMXpEr0qgwGExZRhRxzZTS",
          },
        },
      },
    },
    {
      name: "高级订阅 (Premium Subscription)",
      slug: "premium",
      activeMasseuses: 20, // arbitrary large number to represent unlimited – might need to change this in the future
      price: {
        monthly: {
          amount: 597,
          priceIds: {
            test: "price_1NxMf7Er0qgwGExZrXRd7uhh",
            production: "price_1NxMf7Er0qgwGExZrXRd7uhh",
          },
        },
        yearly: {
          amount: 597*12*0.75,
          priceIds: {
            test: "price_1NxMf7Er0qgwGExZOLl82dzo",
            production: "price_1NxMf7Er0qgwGExZOLl82dzo",
          },
        },
      },
    },
  ];

// Updated the pricing Ids for the rest of the plans. Still not sure what purpose this has?

export function getPlanFromPriceId(priceId: string) {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "production" : "test";

  return PLANS.find(
    (plan) =>
      plan.price.monthly.priceIds[env] === priceId ||
      plan.price.yearly.priceIds[env] === priceId,
  )!;
}

interface Price {
  id?: string
}

// custom type coercion because Stripe's types are wrong
export function isNewCustomer(
  previousAttributes:
    | {
        default_payment_method?: string;
        items?: {
          data?: {
            price?: {
              id?: string;
            }[];
          };
        };
      }
    | undefined,
) {
  let isNewCustomer = false;
  try {
    if (
      // if the project is upgrading from free to pro
      previousAttributes?.default_payment_method === null
    ) {
      isNewCustomer = true;
    } else {
      // if the project is upgrading from pro to enterprise
      const oldPriceId =
        previousAttributes?.items?.data &&
              // @ts-ignore
        previousAttributes?.items?.data[0].price.id;
      if (oldPriceId && getPlanFromPriceId(oldPriceId).slug === "professional") {
        isNewCustomer = true;
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
  return isNewCustomer;
}
