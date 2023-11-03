const Dashboard = async () => {
  // TODO: Should I be using the util server component directly, or a hook exposed from the provider that is wrapping this child page? And then just get the values and setState functions from the provider hooks and then maybe create your own state here in this component and make sure the state updates on this components are updated at the context level? How?

  return <div className="w-full">hi</div>;
};

export default Dashboard;
