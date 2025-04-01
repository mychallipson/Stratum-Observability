import knex from "knex";

import { BaseEventModel,BasePublisher } from "../../base";
import { StratumSnapshot } from "../../types";
import { DatabaseEventContent } from "./types";

export class DatabasePublisher extends BasePublisher {
  name = "database";
  events: string[];

  constructor(events: string[]) {
    super();
    this.events = events;
  }

  shouldPublishEvent(event: BaseEventModel): boolean {
    return this.events.includes(event.eventType);
  }

  getEventOutput(event: BaseEventModel, snapshot: StratumSnapshot) {
    return event.getData(snapshot.eventOptions);
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async publish(content: DatabaseEventContent, snapshot: StratumSnapshot): Promise<void> {
    if (!content.shouldPublishToDB) {
      console.log("Skipping publishing to DB for event", snapshot.event.id);
      return;
    }
    const options = snapshot.plugins.database.context;
    const config = {
      client: options.client,
      connection: {
        host: options.host,
        password: options.password,
        port: options.port,
        ssl: options.ssl,
        user: options.user,
        database: options.database
      }
    }
    const connection = knex(config);
    const contentToPublish = content;
    if (contentToPublish.tableName === undefined) {
      throw new Error("Table name is required to publish to database");
    }
    if (contentToPublish) {
      try {
        connection.initialize();
        console.log("Inserting data into database", contentToPublish.tableName, JSON.stringify(contentToPublish.eventData));
        const rows = await connection(contentToPublish.tableName).insert(contentToPublish.eventData);
        console.log("Data inserted successfully", rows);
      } catch(error) {
        console.log("Failed to publishing to DB", error);
        throw error;
      } finally {
        await connection.destroy();
      }
    }
  }
}
