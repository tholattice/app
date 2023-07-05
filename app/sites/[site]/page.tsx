import { dictionary } from "@/content";

function SiteHome({ params }: { params: { site: string } }) {
  return (
    <div>
      <h1>{dictionary[params.site]?.homeHeader}</h1>
      <p>{dictionary[params.site]?.homeContent}</p>
      <h1>
        Hi there this is a sites page: {dictionary[params.site]?.homeHeader}
      </h1>
    </div>
  );
}

export default SiteHome;
