#!/usr/bin/env node

/**
 * OAuth Configuration Verification Script
 * 
 * This script verifies that your Google OAuth configuration is correct
 * before attempting to use it in the application.
 */

require('dotenv').config();

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║        Google OAuth Configuration Verification               ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const PORT = process.env.PORT || 5001;
const callbackURL = process.env.CALLBACK_URL || `http://localhost:${PORT}/api/auth/google/callback`;

let hasErrors = false;

// Check Client ID
console.log('📋 Checking Configuration...\n');

if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('❌ GOOGLE_CLIENT_ID is missing in .env file');
  hasErrors = true;
} else {
  console.log('✅ GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  if (!process.env.GOOGLE_CLIENT_ID.includes('@')) {
    console.log('   Format looks correct');
  }
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ GOOGLE_CLIENT_SECRET is missing in .env file');
  hasErrors = true;
} else {
  console.log('✅ GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET.substring(0, 10) + '...');
  if (process.env.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
    console.log('   Format looks correct (starts with GOCSPX-)');
  }
}

console.log('\n🔗 Callback URL Configuration:\n');
console.log('   Callback URL:', callbackURL);
console.log('\n⚠️  IMPORTANT: This EXACT URL must be added to Google Cloud Console!\n');
console.log('   Steps to verify:');
console.log('   1. Go to: https://console.cloud.google.com/apis/credentials');
console.log('   2. Click on your OAuth 2.0 Client ID');
console.log('   3. Scroll to "Authorized redirect URIs"');
console.log('   4. Ensure this EXACT URL is listed:');
console.log(`      ${callbackURL}\n`);

if (!hasErrors) {
  console.log('✅ All environment variables are set!\n');
  console.log('📝 Next Steps:');
  console.log('   1. Verify the callback URL in Google Cloud Console (see above)');
  console.log('   2. Ensure the Client ID and Secret match your Google Console');
  console.log('   3. Make sure the OAuth consent screen is configured');
  console.log('   4. Restart your server and try logging in again\n');
} else {
  console.log('\n❌ Configuration errors found. Please fix them before proceeding.\n');
  process.exit(1);
}

