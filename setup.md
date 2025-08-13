# Tholattice App Setup Guide

## Authentication Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tholattice"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

# Email Configuration (Required for email login)
RESEND_API_KEY="your-resend-api-key"

# Stripe Configuration
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLIC_KEY="your-stripe-publishable-key"

# Domain Configuration
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
```

### 2. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### 3. Database Setup

1. Set up a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env.local`
3. Run the database migrations:

```bash
npx prisma migrate dev
```

### 4. Email Provider Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add it to `RESEND_API_KEY` in your `.env.local`

### 5. OAuth Setup (Optional)

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app
3. Add Facebook Login product
4. Get App ID and App Secret
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/facebook`

### 6. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

### 7. Access the App

- Main site: `http://localhost:3000`
- Dashboard: `http://app.localhost:3000`
- Login: `http://app.localhost:3000/login`

## Features Implemented

✅ **Authentication System**
- Email-based login (magic links)
- Google OAuth integration
- Facebook OAuth integration
- Credentials-based login (with password)
- Session management
- Protected routes

✅ **Dashboard**
- User authentication required
- Welcome message with user info
- Quick stats cards
- Recent activity section
- Quick actions
- Logout functionality

✅ **Database Integration**
- Prisma ORM setup
- User model with password field
- NextAuth adapter integration
- Session and account management

✅ **Email System**
- Magic link authentication
- Welcome emails for new users
- Resend integration

## Next Steps

1. **Complete the database setup** - Run migrations and seed data
2. **Add more dashboard features** - Customer management, appointments, etc.
3. **Implement the business logic** - Massage booking, payment processing
4. **Add analytics** - Business metrics and reporting
5. **Mobile app** - React Native implementation

## Troubleshooting

### Common Issues:

1. **Database Connection Error**: Make sure your PostgreSQL database is running and the connection string is correct
2. **Email Not Sending**: Check your Resend API key and domain verification
3. **OAuth Not Working**: Verify redirect URIs and client secrets
4. **Session Issues**: Ensure `NEXTAUTH_SECRET` is set and consistent

### Development Tips:

- Use `console.log` in the auth callbacks to debug authentication flow
- Check the browser's Network tab for API request/response details
- Use Prisma Studio to inspect the database: `npx prisma studio`
