import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import musicRoutes from "./routes/music";
import Music from "./models/Music";

const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/music", musicRoutes);

app.get("/api/debug/music", async (req, res) => {
  const all = await Music.find();
  res.json(all);
});

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

