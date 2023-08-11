import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import "server-only";

import type { Database } from "@/types/supabase";

export const createSupabaseServerClient = () =>
  createServerComponentClient<Database>({
    cookies,
  });
