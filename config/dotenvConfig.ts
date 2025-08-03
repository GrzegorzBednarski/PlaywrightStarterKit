import * as dotenv from 'dotenv';
import * as fs from 'fs';

const fallbackName = 'example';
const envFile = `env/.env.${process.env.ENV || fallbackName}`;
const fallbackFile = `env/.env.${fallbackName}`;

let configPath: string | null = null;

if (fs.existsSync(envFile)) {
  configPath = envFile;
} else if (fs.existsSync(fallbackFile)) {
  configPath = fallbackFile;
  console.warn(
    `⚠️ [dotenv] Environment file '${envFile}' not found. Loaded fallback: ${fallbackFile}`
  );
} else {
  console.error(
    `❌ [dotenv] No environment file found: neither '${envFile}' nor fallback '${fallbackFile}' exist.`
  );
  process.exit(1);
}

dotenv.config({
  path: configPath,
  override: true,
  quiet: true,
});

if (!process.env.__ENV_FILE_LOGGED__) {
  process.env.__ENV_FILE_LOGGED__ = 'true';
  console.log(`✅ [dotenv] Environment configuration loaded from: ${configPath}`);
}
