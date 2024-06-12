const TenantBlogPage = ({ params }: { params: { domain: string } }) => {
  return (
    <div>
      this is a sample top level blog page, and here is the params object:{" "}
      {params.domain}
    </div>
  );
};

export default TenantBlogPage;
