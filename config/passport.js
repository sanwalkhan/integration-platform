const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { OIDCStrategy } = require('passport-azure-ad');
const User = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
}, async (token, tokenSecret, profile, done) => {
  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) {
    return done(null, existingUser);
  } else {
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profilePicture: profile.photos ? profile.photos[0].value : '',
      isEmailVerified: true, // Automatically verified if logging in via Google
    });
    await newUser.save();
    return done(null, newUser);
  }
}));

// passport.use(new OIDCStrategy({
//   clientID: process.env.MICROSOFT_CLIENT_ID,
//   clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
//   callbackURL: `${process.env.BASE_URL}/auth/microsoft/callback`, // Should be valid HTTPS
//   identityMetadata: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/.well-known/openid-configuration`,
//   responseType: 'code id_token',
//   responseMode: 'query',
//   scope: ['openid', 'profile', 'email'],
// }, async (iss, sub, profile, accessToken, refreshToken, done) => {
//   const existingUser = await User.findOne({ microsoftId: profile.id });
//   if (existingUser) {
//     return done(null, existingUser);
//   } else {
//     const newUser = new User({
//       microsoftId: profile.id,
//       name: profile.displayName,
//       email: profile.upn,
//       profilePicture: profile.picture || '',
//       isEmailVerified: true, 
//     });
//     await newUser.save();
//     return done(null, newUser);
//   }
// }));

