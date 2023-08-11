import { NextRequest, NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/types/supabase'

// export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const {searchParams} = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
      await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  // console.log(requestUrl.origin)
  // return NextResponse.redirect('http://app.localhost:3000')}
  return NextResponse.redirect(new URL('http://app.localhost:3000'))}