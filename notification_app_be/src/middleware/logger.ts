import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

type StackType = "backend" | "frontend";

type LevelType =
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

type CommonPackage =
  | "auth"
  | "config"
  | "middleware"
  | "utils";

type PackageType =
  | BackendPackage
  | FrontendPackage
  | CommonPackage;

interface LogPayload {
  stack: StackType;
  level: LevelType;
  package: PackageType;
  message: string;
}

const LOG_API =
  "http://4.224.186.213/evaluation-service/logs";

const TOKEN = process.env.ACCESS_TOKEN;

const Log = async ({
  stack,
  level,
  package: pkg,
  message
}: LogPayload) => {
  try {

    if (!TOKEN) {
      console.log("missing access token");
      return;
    }

    const res = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN.trim()}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("log created", res.data);

    return res.data;

  } catch (err: any) {

    console.log(
      "logger failed",
      err.response?.data || err.message
    );

    return null;
  }
};

export default Log;