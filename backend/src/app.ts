import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import musicRoutes from "./routes/music";
import Music from "./models/Music";
import authRoutes from "./routes/auth";
import session from "express-session";
import passport from "./config/passport";

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Configure session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true in prod. false= http true= https
  })
);

// Initialize passport and manage sessions
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/api/music", musicRoutes);

app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
    }
  );

export default app;

