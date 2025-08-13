# WeChat OAuth Setup Guide

This guide will help you set up WeChat OAuth authentication for your Tholattice application.

## 🎯 Overview

WeChat OAuth allows users to sign in and register using their WeChat accounts. This is particularly useful for Chinese users who prefer WeChat over other authentication methods.

## 📋 Prerequisites

1. **WeChat Open Platform Account**: You need to register as a developer on the WeChat Open Platform
2. **Verified WeChat Official Account**: Required for OAuth functionality
3. **Domain Verification**: Your domain must be verified with WeChat

## 🔧 Step-by-Step Setup

### 1. Register on WeChat Open Platform

1. Go to [WeChat Open Platform](https://open.weixin.qq.com/)
2. Register as a developer (requires Chinese phone number and ID)
3. Complete the developer verification process

### 2. Create a WeChat Official Account

1. In your WeChat Open Platform dashboard, create a new Official Account
2. Choose "Service Account" type for OAuth functionality
3. Complete the account verification process

### 3. Configure OAuth Settings

1. In your Official Account dashboard, go to **Development** → **Basic Configuration**
2. Note down your **AppID** and **AppSecret**
3. Add your authorized domains:
   - **Development**: `http://localhost:3000`
   - **Production**: `https://yourdomain.com`

### 4. Set Up Redirect URLs

1. Go to **Development** → **Web Authorization**
2. Add the following redirect URLs:
   - `http://localhost:3000/api/auth/callback/wechat` (development)
   - `https://yourdomain.com/api/auth/callback/wechat` (production)

### 5. Environment Variables

Add the following variables to your `.env.local` file:

```bash
# WeChat OAuth
WECHAT_CLIENT_ID=your_wechat_app_id
WECHAT_CLIENT_SECRET=your_wechat_app_secret

# Existing variables (keep these)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 6. Production Deployment

For production deployment, update your environment variables:

```bash
# Production environment variables
WECHAT_CLIENT_ID=your_production_wechat_app_id
WECHAT_CLIENT_SECRET=your_production_wechat_app_secret
NEXTAUTH_URL=https://yourdomain.com
```

## 🔍 Testing

### Local Development

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/login`
3. Click "Continue with WeChat"
4. You should be redirected to WeChat's OAuth page
5. After authorization, you'll be redirected back to `/dashboard`

### Production Testing

1. Deploy your application
2. Visit your production login page
3. Test the WeChat OAuth flow
4. Verify users are redirected to the dashboard after login

## 🚨 Important Notes

### WeChat Limitations

1. **Email Not Provided**: WeChat doesn't provide user email addresses
2. **Profile Data**: Limited profile information (nickname, avatar, openid)
3. **Geographic Restrictions**: WeChat OAuth primarily works in China
4. **Mobile Verification**: Users must have a verified WeChat account

### Security Considerations

1. **AppSecret Security**: Never expose your WeChat AppSecret in client-side code
2. **HTTPS Required**: Production must use HTTPS for OAuth callbacks
3. **Domain Verification**: Ensure your domain is properly verified with WeChat

### User Experience

1. **QR Code Login**: WeChat OAuth typically shows a QR code for mobile scanning
2. **Mobile-First**: Best experience on mobile devices
3. **Chinese Users**: Primarily used by Chinese users

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid redirect_uri" Error**
   - Ensure your redirect URL is exactly matched in WeChat settings
   - Check for trailing slashes or protocol mismatches

2. **"AppID not found" Error**
   - Verify your WECHAT_CLIENT_ID is correct
   - Ensure your WeChat app is properly configured

3. **"Scope not allowed" Error**
   - Verify you're using the correct scope: `snsapi_login`
   - Check your app's permissions in WeChat dashboard

4. **Callback Not Working**
   - Ensure your domain is verified with WeChat
   - Check that your app is in the correct state (development/production)

### Debug Mode

To enable debug logging, add to your `.env.local`:

```bash
DEBUG=next-auth:*
```

## 📚 Additional Resources

- [WeChat Open Platform Documentation](https://developers.weixin.qq.com/doc/)
- [WeChat OAuth API Reference](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/WeChat_Login.html)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## 🎉 Success!

Once configured, users will be able to:
- Sign in with their WeChat account
- Register new accounts using WeChat
- Access the dashboard seamlessly
- Have their profile information synced from WeChat

The authentication flow will be:
1. User clicks "Continue with WeChat"
2. Redirected to WeChat OAuth page
3. User authorizes your app
4. Redirected back to your app
5. Automatically logged in and redirected to dashboard
