# User Guide - Portal Account & Game Linking

Complete guide for users to create accounts, login, and link their game accounts to the portal.

## Table of Contents

- [Registration](#registration)
- [Login](#login)
- [Account Management](#account-management)
- [Linking Game Accounts](#linking-game-accounts)
- [Two-Factor Authentication](#two-factor-authentication)
- [Troubleshooting](#troubleshooting)

---

## Registration

### How to Create a Portal Account

1. **Navigate to Registration Page**
   - Visit: `https://your-domain.com/register`
   - Or click "Create Account" button on the homepage

2. **Fill Out the Registration Form**
   - **Email Address:** Enter a valid email address
   - **Password:** Choose a strong password (minimum 8 characters)
   - **Confirm Password:** Re-enter your password
   - **Terms of Service:** Check the box to agree

3. **Submit the Form**
   - Click "Create Account" button
   - Wait for confirmation

4. **Success!**
   - You'll be redirected to the login page
   - Your account is now created with Argon2id encryption

### Password Requirements

- Minimum 8 characters
- Maximum 128 characters
- Recommended: Mix of uppercase, lowercase, numbers, and symbols

### Registration Troubleshooting

**Problem:** "Email already registered"
- **Solution:** Use a different email address or login with existing account

**Problem:** "Passwords do not match"
- **Solution:** Ensure both password fields contain the exact same text

---

## Login

### How to Login

1. **Navigate to Login Page**
   - Visit: `https://your-domain.com/login`
   - Or click "Login" in the navigation

2. **Enter Your Credentials**
   - **Email:** Your registered email address
   - **Password:** Your portal password

3. **Login Methods**

   **Option A: Email/Password**
   - Enter email and password
   - Click "Login" button

   **Option B: OAuth (Google)**
   - Click "Google" button
   - Authorize access in the popup
   - You'll be redirected to your account

   **Option C: OAuth (Discord)**
   - Click "Discord" button
   - Authorize access in the popup
   - You'll be redirected to your account

4. **Success!**
   - You'll be redirected to your Account Management page
   - Session valid for 30 days

### Login Troubleshooting

**Problem:** "Invalid email or password"
- **Solution:** Double-check your credentials
- **Solution:** Reset password (coming soon)

**Problem:** "Too many login attempts"
- **Solution:** Wait 15 minutes before trying again
- Rate limiting protects against brute force attacks

---

## Account Management

After logging in, you'll see your Account Management dashboard at `/account`.

### Portal Account Section

View your portal account information:
- **Email:** Your registered email
- **Role:** User role (user/admin)
- **Sign Out:** Logout button

### Available Actions

- **Link Game Accounts:** Connect your in-game characters
- **Configure MFA:** Add two-factor authentication (coming soon)
- **Manage OAuth:** View connected social accounts

---

## Linking Game Accounts

Link your existing game characters to your portal account for unified authentication.

### How to Link a Game Account

1. **Navigate to Account Management**
   - Login to portal
   - Visit `/account` or click your profile

2. **Click "Link New Account"**
   - Opens the linking form

3. **Fill Out the Form**
   
   **Game Server:** Select from dropdown
   - Choose the server where your character exists
   - Example: "Main Server (EU)", "Secondary Server (US)"

   **Game Username:** Your in-game account name
   - Enter the exact username from your game account
   - Case-sensitive

   **Game Password:** Your in-game account password
   - Enter your game account password (NOT your portal password)
   - This is used only for verification
   - **Never stored** - only verified against legacy database

4. **Submit the Form**
   - Click "Link Account"
   - System verifies credentials against game database

5. **Success!**
   - Account appears in "Linked Game Accounts" list
   - Status shows: ✓ Verified

### Understanding Account Status

**✓ Verified (Green)**
- Account credentials successfully verified
- Link is active and valid

**⚠ Pending Verification (Yellow)**
- Account link created but not yet verified
- This happens if legacy database is not configured
- Contact admin to verify manually

**❌ Invalid (Red)**
- Verification failed
- Password may have changed in game
- Re-link with correct credentials

### Unlinking a Game Account

1. Find the account in your "Linked Game Accounts" list
2. Click "Unlink" button
3. Confirm the action
4. Account link is removed

### Linking Troubleshooting

**Problem:** "Server not found"
- **Solution:** Contact admin to add the game server configuration
- Admins can add servers at `/servers`

**Problem:** "Invalid game credentials"
- **Solution:** Double-check your in-game username and password
- **Solution:** Ensure you're selecting the correct server
- **Note:** Username is case-sensitive

**Problem:** "Legacy database not configured"
- **Solution:** Contact admin to configure game database connection
- Link will be created as "Pending" until database is set up

**Problem:** "Account already linked"
- **Solution:** One game account can only be linked to one portal account
- **Solution:** Unlink from previous portal account first (if you have access)

---

## Two-Factor Authentication (MFA)

**Status:** ✅ Available

Two-Factor Authentication (MFA) adds an extra layer of security to your portal account using:
- **TOTP Apps:** Google Authenticator, Authy, 1Password, Microsoft Authenticator, etc.
- **Backup Codes:** 8 recovery codes if you lose access to your device

### Why Enable MFA?

- Protects against password theft and phishing
- Recommended for all users, required for admin accounts
- Industry best practice for account security
- Prevents unauthorized access even if password is compromised

### Setting Up MFA

1. **Navigate to Account Management**
   - Go to `/account` after logging in
   - Find the "Security" section

2. **Enable MFA**
   - Click "Enable MFA" button
   - API generates a unique TOTP secret for your account

3. **Scan QR Code**
   - Open your authenticator app (Google Authenticator, Authy, etc.)
   - Scan the displayed QR code
   - Alternatively, manually enter the secret key shown

4. **Verify Setup**
   - Enter the 6-digit code shown in your authenticator app
   - Click "Verify" to enable MFA
   - You'll receive a confirmation email

5. **Save Backup Codes**
   - After enabling, generate 8 backup codes
   - Save these codes in a secure location (password manager or printed copy)
   - Each code can be used once if you lose access to your device

### Using MFA at Login

Once MFA is enabled:

1. **Enter Email & Password** as usual
2. **Enter TOTP Code** when prompted
   - Open your authenticator app
   - Enter the current 6-digit code
   - Code changes every 30 seconds

3. **Alternative: Use Backup Code**
   - If you don't have access to your authenticator
   - Use one of your 8 backup codes instead
   - Each backup code can only be used once

### Regenerating Backup Codes

If you've used some backup codes or lost them:

1. Go to `/account` → Security section
2. Click "Regenerate Backup Codes"
3. Enter current TOTP code or password
4. New set of 8 codes will be generated
5. Old codes are invalidated

### Disabling MFA

If you need to disable MFA:

1. Go to `/account` → Security section
2. Click "Disable MFA"
3. Enter your password to confirm
4. Enter current TOTP code
5. MFA is disabled and backup codes are deleted
6. You'll receive a notification email

⚠️ **Important**: Disabling MFA reduces your account security. Only disable if absolutely necessary.

### MFA Troubleshooting

**Problem:** TOTP codes not working
- **Solution:** Ensure your device time is synchronized (NTP)
- **Solution:** Wait for next code (codes change every 30 seconds)
- **Solution:** Try entering the code again immediately

**Problem:** Lost access to authenticator app
- **Solution:** Use one of your 8 backup codes to login
- **Solution:** After login, you can disable and re-enable MFA with a new device

**Problem:** Lost backup codes
- **Solution:** Login with TOTP code
- **Solution:** Generate new backup codes from account settings

**Problem:** QR code won't scan
- **Solution:** Use manual entry instead
- **Solution:** Copy and paste the secret key into your authenticator app
- **Solution:** Ensure QR code is fully visible and not distorted

---

## Password Reset

If you forget your password or need to reset it:

### Requesting Password Reset

1. **Go to Reset Page**
   - Visit `/reset-password` or click "Forgot Password" on login page
   - Enter your email address

2. **Check Your Email**
   - You'll receive a password reset email within minutes
   - Email contains a secure reset link
   - Link is valid for **1 hour only**

3. **Set New Password**
   - Click the link in the email
   - Enter your new password (minimum 8 characters)
   - Confirm the new password
   - Submit the form

4. **Success**
   - Your password is updated using Argon2id hashing
   - All active sessions are invalidated (you'll need to login again)
   - You receive a confirmation email

### Password Reset Security

- **No Email Enumeration**: System doesn't reveal if email exists
- **One-Time Use**: Reset links can only be used once
- **Time-Limited**: Links expire after 1 hour
- **Session Invalidation**: All sessions are logged out after reset
- **Audit Logging**: Password resets are logged for security monitoring

### Password Reset Troubleshooting

**Problem:** Email not received
- **Solution (Dev)**: Check console output and `logs/emails.log` file
- **Solution (Prod)**: Check spam/junk folder
- **Solution**: Wait a few minutes and request again
- **Solution**: Verify email address is correct

**Problem:** Reset link expired
- **Solution**: Request a new reset link
- **Note**: Links expire after 1 hour for security

**Problem:** "Invalid or expired token" error
- **Solution**: Link may have been used already
- **Solution**: Request a new reset link
- **Note**: Each link can only be used once

**Problem:** Can't access email account
- **Solution**: Contact administrator for manual password reset
- **Note**: Have account verification information ready

---

## Troubleshooting

### General Issues

**Problem:** Can't access Account Management page
- **Solution:** Ensure you're logged in
- **Solution:** Clear browser cookies and login again

**Problem:** Session expired
- **Solution:** Login again
- Sessions last 30 days of inactivity

**Problem:** OAuth login not working
- **Solution:** Ensure popups are not blocked
- **Solution:** Try disabling browser extensions
- **Solution:** Check if cookies are enabled

### Security Best Practices

1. **Use a strong, unique password** for your portal account
2. **Don't share your password** with anyone
3. **Enable 2FA** when available
4. **Use OAuth login** (Google/Discord) for added convenience
5. **Keep your email secure** - it's used for account recovery
6. **Sign out** when using shared computers
7. **Regularly verify** your linked game accounts

### Getting Help

**For Account Issues:**
- Contact support via `/contact` page
- Provide your portal email (not password!)

**For Game Server Issues:**
- Contact game server administrators
- Check server status page

**For Technical Issues:**
- Check browser console for errors (F12 -> Console)
- Try different browser (Chrome, Firefox, Edge)
- Clear cache and cookies

---

## Feature Comparison

| Feature | Legacy System | New Portal |
|---------|--------------|------------|
| Password Hashing | MD5/SHA256 | Argon2id ✓ |
| OAuth Login | ❌ | ✓ Google, Discord |
| 2FA Support | ❌ | ✓ (Coming) |
| Multi-Server | ❌ | ✓ |
| Account Linking | ❌ | ✓ |
| Session Management | Basic | JWT + DB ✓ |
| Rate Limiting | ❌ | ✓ |
| Audit Logging | Limited | Full ✓ |

---

## FAQ

**Q: Do I need to create a new portal account if I have a game account?**  
A: Yes, the portal uses separate, more secure accounts. You'll link your game accounts after registering.

**Q: What happens to my game account after linking?**  
A: Nothing changes in the game. The portal only reads your account for verification.

**Q: Can I link multiple game accounts?**  
A: Yes! You can link accounts from different servers to one portal account.

**Q: Is my game password stored?**  
A: No. Your game password is only used once for verification and is never stored.

**Q: Can I use the same password for portal and game?**  
A: You can, but it's recommended to use different passwords for security.

**Q: What if I forget my portal password?**  
A: Password reset feature is coming soon. Contact support for help.

**Q: Can I delete my portal account?**  
A: Account deletion feature is coming soon. Contact support for manual deletion.

---

## Next Steps

- ✓ Create your portal account at `/register`
- ✓ Login at `/login`
- ✓ Link your game accounts at `/account`
- ⏳ Enable 2FA when available
- ⏳ Explore additional features as they're released

---

**Last Updated:** January 2025  
**Version:** 0.5.0 (Phase 2)
