import { PluginContext } from "../../types/plugin";


export interface DatabaseEventContent {
  eventData: Record<string, unknown>;
  tableName: string;
  shouldPublishToDB: boolean;
}

export interface DatabasePluginContext extends PluginContext {
  client: string;
  host: string;
  port: number;
  ssl: {
    ca: string;
    rejectUnauthorized: boolean;
  };
  user: string;
  database: string;
  password: string;
}

export interface DatabaseOptions {
  defaultContext?: DatabasePluginContext;
}
