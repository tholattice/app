import Link from "next/link";
import Image from "next/image";

const TholatticeFinances = async () => {
  return (
    <>
      <div className="flex h-screen justify-center items-center">
        <Link href="https://dashboard.stripe.com/billing">
          <h2>Visit the billing center for more info</h2>
          <div className="rounded-lg cursor-pointer">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
              width={250}
              height={250}
              alt="Stripe Logo"
            />
          </div>
        </Link>
      </div>
    </>
  );
};

export default TholatticeFinances;
