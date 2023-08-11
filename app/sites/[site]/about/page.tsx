import { dictionary } from "@/content";
import SampleComp from "../components/SampleComp";

function About({ params }: { params: { site: string } }) {
  //   console.log(params);
  return (
    <div className="bg-blue-500">
      <h1>{dictionary[params.site]?.homeHeader}</h1>
      <p>{dictionary[params.site]?.homeContent}</p>
      <h1>Hi there its the about page</h1>
      <SampleComp />
    </div>
  );
}

export default About;
