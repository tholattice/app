import { dictionary } from "@/content";

function Page({ params }: { params: { site: string } }) {
  //   console.log(params);
  return (
    <div>
      <h1>{dictionary[params.site]?.homeHeader}</h1>
      <p>{dictionary[params.site]?.homeContent}</p>
      <h1>Hi there it's the tholattice main about page</h1>
    </div>
  );
}

export default Page;
