import { config } from "dotenv";

config({ path: `.env` });

export const { PORT, jwt_secret, jwt_expires_in, ARCJET_ENV, ARCJET_KEY } =
  process.env;
