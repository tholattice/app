# Google OAuth Setup Guide for Tholattice

## New Architecture (No Subdomains)

### **Development & Production**
- **Main site**: `http://localhost:3000` (dev) / `https://tholattice.com` (prod)
- **Dashboard**: `http://localhost:3000/dashboard` (dev) / `https://tholattice.com/dashboard` (prod)
- **Auth**: `http://localhost:3000/auth/login` (dev) / `https://tholattice.com/auth/login` (prod)
- **Auth callback**: `http://localhost:3000/api/auth/callback/google`

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Tholattice App")
4. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google Identity" and enable it
4. Also enable "Google+ API" if available

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - User Type: External
   - App name: "Tholattice"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and continue through the steps

4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "Tholattice Web Client"
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:3001
     https://tholattice.com (when deployed)
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     http://localhost:3001/api/auth/callback/google
     https://tholattice.com/api/auth/callback/google (when deployed)
     ```

5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

## Step 4: Update Environment Variables

Add these to your `.env.local` file:

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

## Step 5: Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/dashboard`
3. You should be redirected to `http://localhost:3000/auth/login`
4. Click "Continue with Google"
5. You should be redirected to Google's consent screen
6. After authorization, you should be redirected to your dashboard at `http://localhost:3000/dashboard`

## How the Authentication Flow Works

### **Complete Flow**:
1. User visits: `http://localhost:3000/dashboard` (dashboard)
2. If not authenticated: Redirected to `http://localhost:3000/auth/login`
3. User clicks "Continue with Google": Authenticates at `http://localhost:3000`
4. Google redirects back to: `http://localhost:3000/api/auth/callback/google`
5. NextAuth redirects to: `http://localhost:3000/dashboard` (dashboard)

## URL Structure

### **Main Site Pages**:
- Home: `http://localhost:3000/`
- About: `http://localhost:3000/about`
- Services: `http://localhost:3000/services`
- Contact: `http://localhost:3000/contact`
- Pricing: `http://localhost:3000/pricing`

### **Authentication Pages**:
- Login: `http://localhost:3000/auth/login`
- Register: `http://localhost:3000/auth/register`

### **Dashboard Pages**:
- Dashboard: `http://localhost:3000/dashboard`
- Customers: `http://localhost:3000/dashboard/customers`
- Finances: `http://localhost:3000/dashboard/finances`
- Marketing: `http://localhost:3000/dashboard/marketing`
- Pipeline: `http://localhost:3000/dashboard/pipeline`

## Common Issues and Solutions

### Issue 1: "Error: redirect_uri_mismatch"
**Solution**: Make sure your redirect URI in Google Cloud Console exactly matches:
```
http://localhost:3000/api/auth/callback/google
```

### Issue 2: "Error: invalid_client"
**Solution**: 
- Check that your Client ID and Client Secret are correct
- Make sure you copied the entire Client ID (it's usually a long string ending with `.apps.googleusercontent.com`)

### Issue 3: "Error: access_denied"
**Solution**: 
- Check that your OAuth consent screen is properly configured
- Make sure the Google+ API is enabled
- Verify your app is not in testing mode (or add your email as a test user)

### Issue 4: "Error: invalid_request"
**Solution**:
- Check that your `NEXTAUTH_URL` matches your actual development URL
- Ensure all environment variables are properly set

## Why This New Architecture Works

### **Benefits**:
- ✅ **Single Domain**: Everything on one domain - no subdomain complexity
- ✅ **Google OAuth Friendly**: No issues with localhost subdomains
- ✅ **Simpler Routing**: All routes under one domain
- ✅ **Better SEO**: Main site and dashboard on same domain
- ✅ **Easier Development**: No need to manage multiple domains/subdomains
- ✅ **Production Ready**: Works seamlessly in production

### **Architecture Overview**:
```
tholattice.com/
├── / (main site)
├── /about
├── /services
├── /contact
├── /auth/
│   ├── /login
│   └── /register
└── /dashboard/
    ├── / (main dashboard)
    ├── /customers
    ├── /finances
    ├── /marketing
    └── /pipeline
```

## Production Deployment

When deploying to production:

1. Update your Google Cloud Console credentials:
   - Add your production domain to "Authorized JavaScript origins"
   - Add your production callback URL to "Authorized redirect URIs"

2. Update your environment variables:
   ```bash
   NEXTAUTH_URL="https://tholattice.com"
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

3. Make sure your production domain is added to the OAuth consent screen

## Security Best Practices

1. **Never commit your `.env.local` file** to version control
2. **Use different OAuth credentials** for development and production
3. **Regularly rotate your Client Secret** if compromised
4. **Monitor your OAuth usage** in Google Cloud Console
5. **Set up proper error logging** to track authentication issues

## Testing Checklist

- [ ] Google OAuth consent screen is configured
- [ ] Google+ API is enabled
- [ ] OAuth 2.0 credentials are created
- [ ] Redirect URIs are correctly set
- [ ] Environment variables are configured
- [ ] NextAuth secret is generated
- [ ] Login flow works in development
- [ ] User is redirected to dashboard after login
- [ ] Session persists across page refreshes
- [ ] Logout functionality works
- [ ] Dashboard routes are protected
- [ ] Auth routes redirect authenticated users

## Troubleshooting Commands

```bash
# Check if environment variables are loaded
echo $GOOGLE_CLIENT_ID

# Generate a new NextAuth secret
openssl rand -base64 32

# Test the build
npm run build

# Start development server
npm run dev

# Check Prisma client
npx prisma generate
```

## Support

If you're still having issues:

1. Check the browser's Network tab for detailed error messages
2. Look at the server console for NextAuth logs
3. Verify all environment variables are set correctly
4. Test with a fresh Google Cloud project if needed
5. Check that the Prisma client is up to date
