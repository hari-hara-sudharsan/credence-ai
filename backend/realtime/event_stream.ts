import { EventEmitter } from "events";

export class EventStream {
  private emitter = new EventEmitter();
  private clients: Set<any> = new Set();

  public broadcast(eventType: string, data: any) {
    const payload = JSON.stringify({ event: eventType, data });
    for (const client of this.clients) {
      client.write(`data: ${payload}\n\n`);
    }
  }

  public addClient(res: any) {
    this.clients.add(res);
    res.on("close", () => {
      this.clients.delete(res);
    });
  }
}

export const eventStream = new EventStream();
