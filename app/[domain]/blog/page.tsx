const TenantBlogPage = async ({ params }: { params: Promise<{ domain: string }> }) => {
  const { domain } = await params;
  return (
    <div>
      this is a sample top level blog page, and here is the params object:{" "}
      {domain}
    </div>
  );
};

export default TenantBlogPage;
