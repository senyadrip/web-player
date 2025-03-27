import { Router, Request, Response } from "express";
import passport, { isAdmin } from "../config/passport";
import { DiscordUser } from "../types/types";

const router = Router();

router.get("/status", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user = req.user as DiscordUser;

    const isAdminUser =
      req.isAuthenticated() && user && isAdmin(req, res, () => {});

    return res.status(200).json({
      loggedIn: true,
      user,
      isAdmin: isAdminUser === undefined,
    });
  } else {
    return res.status(200).json({ loggedIn: false, isAdmin: false });
  }
});

router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: "/",
    successRedirect: "http://localhost:5174",
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5174");
  });
});

export default router;
