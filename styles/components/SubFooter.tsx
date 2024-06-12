const SubFooter = () => {
  // TODO: There needs to be props passed in for massage name.

  return (
    <div className="bg-blue-100 p-2">
      Sample Massage Name &copy; {new Date().getFullYear()}. All Rights
      Reserved.
    </div>
  );
};

export default SubFooter;
