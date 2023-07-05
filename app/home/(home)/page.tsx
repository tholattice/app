import { dictionary } from "@/content";

function TholatticeHome({ params }: { params: { site: string } }) {
  // console.log(params);
  return (
    <div>
      <h1>{dictionary[params.site]?.homeHeader}</h1>
      <p>{dictionary[params.site]?.homeContent}</p>
      <h1>Hi there this is the main tholattice page</h1>
    </div>
  );
}

export default TholatticeHome;
