const TenantAboutPage = ({ params }: { params: { domain: string } }) => {
  return <div>this is the about page for this domain: {params.domain}</div>;
};

export default TenantAboutPage;
