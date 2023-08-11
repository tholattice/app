// const getAllUsers = async () => {

import { useSupabase } from "@/providers/SupabaseProvider";
import { createSupabaseServerClient } from "@/utils/SupabaseServer";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// };

const Dashboard = async () => {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: Should I be using the util server component directly, or a hook exposed from the provider that is wrapping this child page? And then just get the values and setState functions from the provider hooks and then maybe create your own state here in this component and make sure the state updates on this components are updated at the context level? How?

  // const allUser = await getAllUsers();
  // const {data} = await.supabase
  // const supabase = await createServerComponentClient();

  return (
    <div className="w-full">
      <ul>
        <li>This is your email address: {user?.email}</li>
        <li>This is your id: {user?.id}</li>
        <li>This is your authentication status: {user?.role}</li>
        <li>
          These are the social login providers you have logged in with in the
          past: {user?.identities?.map((identity) => identity.provider)}
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
