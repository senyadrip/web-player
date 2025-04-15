import passport from "passport";
import dotenv from "dotenv";
import { Strategy as DiscordStrategy, Profile } from "passport-discord";
import { Request, Response, NextFunction } from "express";
import { DiscordUser } from "../types/types";

dotenv.config();

const adminDiscordIds = process.env.ADMIN_DISCORD_IDS?.split(",") || [];

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: DiscordUser, done) => {
  done(null, obj);
});

// passport.use(
//   new DiscordStrategy(
//     {
//       clientID: process.env.DISCORD_CLIENT_ID || "",
//       clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
//       callbackURL: process.env.DISCORD_CALLBACK_URL || "",
//       scope: ["identify"],
//     },
//     (accessToken, refreshToken, profile: Profile, done) => {
//       const user: DiscordUser = {
//         id: profile.id,
//         username: profile.username,
//         discriminator: profile.discriminator,
//         avatar: profile.avatar,
//       };
//       return done(null, user);
//     }
//   )
// );

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DiscordUser;

  console.log("User attempting action:", user);
  console.log("Admin IDs:", adminDiscordIds);

  if (req.isAuthenticated() && user && adminDiscordIds.includes(user.id)) {
    console.log("User is an admin.");
    return next();
  } else {
    console.log("User is NOT an admin.");
  }

};

export default passport;