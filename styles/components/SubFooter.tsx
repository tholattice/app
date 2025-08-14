const SubFooter = () => {
  // Note: Props needed for massage name

  return (
    <div className="bg-blue-100 p-2">
      Sample Massage Name &copy; {new Date().getFullYear()}. All Rights
      Reserved.
    </div>
  );
};

export default SubFooter;
