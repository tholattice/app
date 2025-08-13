const TenantAboutPage = async ({ params }: { params: Promise<{ domain: string }> }) => {
  const { domain } = await params;
  return <div>this is the about page for this domain: {domain}</div>;
};

export default TenantAboutPage;
