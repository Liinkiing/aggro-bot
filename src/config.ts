import * as dotenv from 'dotenv';
import fs from 'fs';
import * as pathHelper from 'path'

dotenv.config();
// tslint:disable-next-line:one-variable-per-declaration
let envConfig, path;
switch (process.env.NODE_ENV) {
  case 'test':
    path = pathHelper.resolve(`${__dirname}/../.env.test`);
    if (fs.existsSync(path)) {
      envConfig = dotenv.parse(fs.readFileSync(path));
      for (const k in envConfig) {
        if (envConfig.hasOwnProperty(k)) {
          process.env[k] = envConfig[k];
        }
      }
    }
    break;
  case 'production':
    path = pathHelper.resolve(`${__dirname}/../.env.production`);
    if (fs.existsSync(path)) {
      envConfig = dotenv.parse(fs.readFileSync(path));
      for (const k in envConfig) {
        if (envConfig.hasOwnProperty(k)) {
          process.env[k] = envConfig[k];
        }
      }
    }
    break;
  default:
    path = pathHelper.resolve(`${__dirname}/../.env.local`);
    if (fs.existsSync(path)) {
      envConfig = dotenv.parse(fs.readFileSync(path));
      for (const k in envConfig) {
        if (envConfig.hasOwnProperty(k)) {
          process.env[k] = envConfig[k];
        }
      }
    }
}
