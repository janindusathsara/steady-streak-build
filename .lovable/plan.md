

## Problem

After Google OAuth completes, the `handleGoogleSignIn` function in `login.tsx` doesn't navigate to `/app`. Here's the flow:

1. User clicks "Continue with Google"
2. Browser redirects to Google, user authenticates
3. Browser redirects back to the `redirect_uri` (`/app`)
4. **But**: if the OAuth flow uses a popup or token exchange instead of a full redirect, the `lovable.auth.signInWithOAuth` call returns with `result.redirected = false` and no error — the session is set, but no navigation happens

The code only handles `result.error` — it never handles the success case where `result.redirected` is falsy and there's no error (meaning tokens were received and session was set successfully).

## Fix

**File: `src/routes/login.tsx`** — In `handleGoogleSignIn`, after the error check, add navigation for the success case:

```typescript
const result = await lovable.auth.signInWithOAuth("google", {
  redirect_uri: `${window.location.origin}/app`,
});

if (result.error) {
  toast.error(...);
} else if (!result.redirected) {
  // Session was set successfully via token exchange — navigate now
  navigate({ to: "/app" });
}
```

When `result.redirected` is true, the browser is already navigating to the redirect URI, so we do nothing. When it's false and there's no error, tokens were exchanged inline and the session is ready — we just need to programmatically navigate.

This is a one-line addition that closes the gap in the auth flow.

