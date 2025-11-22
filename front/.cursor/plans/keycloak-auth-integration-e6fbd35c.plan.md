<!-- e6fbd35c-2937-4a5b-92f2-181d0ff55d40 bdeeab68-e9d2-427c-807b-0d3edd23cb8b -->
# Keycloak Authentication Integration Plan

## Configuration Values

Based on your setup and Next.js running on port 3000:

- **redirect_uri**: `http://localhost:3000` (Keycloak redirects here after login)
- **post_logout_redirect_uri**: `http://localhost:3000/` (redirect after logout)

## Implementation Steps

### 1. Create Auth Provider Component

**File**: `src/providers/AuthProvider.tsx` (new file)

Create a client-side wrapper for `react-oidc-context`'s AuthProvider with Keycloak configuration:

- Mark as `"use client"` (Next.js requirement)
- Configure OIDC settings with your Keycloak realm details
- Add `onSigninCallback` to clean up URL after redirect
- Use `WebStorageStateStore` with sessionStorage for session persistence (more secure than localStorage)

### 2. Wrap Application with Auth Provider

**File**: `src/app/layout.tsx`

Import and wrap children with the custom AuthProvider component to make authentication available throughout the app.

### 3. Update NavBar with Authentication Logic

**File**: `src/components/NavBar.tsx`

Modify the navbar to:

- Use `useAuth()` hook to access authentication state
- Show only logo + Login button when NOT authenticated
- Show all navigation links + Logout button when authenticated
- Handle loading state appropriately
- Implement login/logout button handlers using `signinRedirect()` and `signoutRedirect()`

### 4. Protect Pages with Route Guards

**Files**:

- `src/app/calcular-costo/page.tsx`
- `src/app/consultar-envio/page.tsx`
- `src/app/crear-envio/page.tsx`

For each protected page:

- Use `useAuth()` hook to check authentication
- Redirect to `/` if not authenticated using Next.js `useRouter()`
- Show loading state while checking authentication
- Keep existing page functionality once authenticated

### 5. Update Home Page (Optional Enhancement)

**File**: `src/app/page.tsx`

Add authentication context to display personalized welcome message when user is logged in.

## Key Technical Details

- **Next.js Compatibility**: All components using `useAuth()` must be client components (`"use client"`)
- **Redirect Strategy**: Use Next.js router for internal redirects (to `/`)
- **Session Persistence**: Using localStorage allows users to remain logged in across tabs/refreshes
- **Loading States**: Handle `isLoading` to prevent flickering during auth checks

### To-dos

- [ ] Create src/providers/AuthProvider.tsx with Keycloak OIDC configuration
- [x] Update src/app/layout.tsx to wrap application with AuthProvider
- [x] Modify NavBar.tsx to show login/logout based on auth state
- [x] Add authentication guard to calcular-costo page
- [x] Add authentication guard to consultar-envio page
- [x] Add authentication guard to crear-envio page