import { v4 as uuidv4 } from "uuid";

export default class Command {
    constructor(fn, argsArray, emitter, { id, timestamp } = {}) {
        this.id = id || uuidv4();
        this.fn = fn;
        this.args = argsArray;
        this.timestamp = timestamp || Date.now();
        this.emitter = emitter;

        return Object.seal(this);
    }

    toJson() {
        return JSON.stringify(this);
    }
    toObject() {
        return JSON.parse(JSON.stringify(this));
    }

    static FromJson(json) {
        let obj = json;

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(obj);
        }

        return new Command(
            obj.fn,
            obj.args,
            obj.emitter,
            {
                id: obj.id,
                timestamp: obj.timestamp
            }
        );
    }

    static Conforms(obj) {
        if(obj instanceof Command) {
            return true;
        } else if(typeof obj !== "object") {
            return false;
        }

        return "id" in obj
            && "fn" in obj
            && "args" in obj
            && "timestamp" in obj
            && "emitter" in obj;
    }
    static JsonConforms(json) {
        let obj = json;

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(obj);
        }

        return Command.Conforms(obj);
    }
}