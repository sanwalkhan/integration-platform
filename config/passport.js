
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User');

// // Local strategy for authentication
// passport.use(
//   new LocalStrategy(
//     { usernameField: 'workEmail' }, 
//     async (workEmail, password, done) => {
//       try {
//         const user = await User.findOne({ workEmail });
//         if (!user) return done(null, false, { message: 'Invalid credentials' });

//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// // Serialize and deserialize user (to store user data in session)
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });


const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

// Local strategy for authentication
passport.use(
  new LocalStrategy(
    { usernameField: 'workEmail' },
    async (workEmail, password, done) => {
      try {
        const user = await User.findOne({ workEmail });
        if (!user) return done(null, false, { message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          workEmail: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          isEmailVerified: true,
          profilePicture: profile.photos[0].value
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: process.env.MICROSOFT_CALLBACK_URL,
    scope: ['user.read'],
    tenant: 'common'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ microsoftId: profile.id });
      if (!user) {
        user = new User({
          microsoftId: profile.id,
          workEmail: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          isEmailVerified: true,
          profilePicture: profile._json.picture
        });
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

