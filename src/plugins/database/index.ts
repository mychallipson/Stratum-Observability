import { BasePlugin } from '../../base';
import { PluginFactory } from '../../types';
import { DatabasePublisher } from './publisher';
import { DatabaseOptions, DatabasePluginContext } from './types';


export class DatabasePlugin extends BasePlugin<DatabasePluginContext, DatabaseOptions> {
  name = "database";
  publishers = [new DatabasePublisher([])];
  context: DatabasePluginContext;
  options: DatabaseOptions;

  constructor(options?: DatabaseOptions) {
    super();
    this.options = options ?? {};
    this.context = Object.assign(
      {
        client: "",
        host: "",
        port: 0,
        ssl: false,
        username: "",
        password: "",
        user: "",
        database: "",
      },
      this.options.defaultContext
    );
  }
}

export const DatabasePluginFactory: PluginFactory<DatabasePlugin> = (options?: DatabaseOptions) => new DatabasePlugin(options);

export * from './publisher';
