import packageJson from '../../package.json';

const BUILD_SIGNATURE = "AFAM-GARDA26";
const DB_SIGNATURE = "AFAMM-GARDA26";

export interface SystemDiagnostic {
  status: "Active" | "Inactive" | "Degraded";
  version: string;
  buildSignature: string;
  developer: string;
  environment: string;

  framework: string;
  project: string;
  databaseSignature: string;
  createdTimestamp: string;
}

export function getSystemDiagnostics(): SystemDiagnostic {
  return {
    status: "Active",
    version: packageJson.version,
    buildSignature: BUILD_SIGNATURE,
    developer: "AkhmadFabiyan",
    environment: process.env.NODE_ENV || "development",

    framework: "Next.js",
    project: "GARDA UNESA 2026",
    databaseSignature: DB_SIGNATURE,
    createdTimestamp: "2026-06-05T00:00:00Z"
  };
}
