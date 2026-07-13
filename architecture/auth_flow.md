# InsightFlow Authentication Flow

## Overview
InsightFlow transitions from a WordPress-based user authentication system (via PHP sessions) to a modern, decoupled React frontend using **Supabase Auth**.

## The B.L.A.S.T. Authentication Handshake
1. **Trigger**: User clicks "Get Started" or "Sign In" on the Landing Page (`/`).
2. **Action**: The React app calls `supabase.auth.signInWithOAuth()` using the designated provider (e.g., Google or Email Magic Link).
3. **Callback**: Supabase redirects the user to `/auth/callback` with a secure token fragment in the URL hash.
4. **Session Establishment**: 
   - `useEffect` on `<AuthCallback />` captures the token.
   - Using Supabase's JS Client, the local session is established.
5. **Authorization Verification**:
   - The token's `auth.uid()` corresponds to a record in public.clients.
   - If missing, a Supabase DB Trigger (`handle_new_user`) creates the user in `public.clients` automatically.
6. **Routing**: The frontend dynamically routes the user to:
   - `/dashboard` (If `clients.plan` is basic/standard/premium).
   - `/admin` (If the user role matches admin criteria, handled via custom claims or specialized table).

## Edge Cases & Error Handling
- **Missing Token**: Redirects immediately back to `/`.
- **Expired Session**: React Router wrapper `<ProtectedRoute />` intercepts the expired session state, clears local storage, and redirects to `/`.
- **Server Communication**: The active JWT (`supabase.auth.getSession().access_token`) is attached as a Bearer token to any backend REST API requests (acting as proof of identity).

## The JWT Utility (Admin Only)
For fallback integrations (like the legacy PHP plugin `insightflow-automation-manager.php`), an Admin can generate short-lived JWTs manually:
- Uses the Supabase `pgcrypto` functions or Edge Functions to sign a manual JWT using the JWT Secret.
- This allows legacy forms to ping n8n webhooks acting "on behalf" of users securely.
