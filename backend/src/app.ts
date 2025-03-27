import express, { Application } from "express";

const app: Application = express();

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

