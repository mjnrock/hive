import Hive from "./../lib/package";
import { spawnStateNode } from "./../lib/state";

console.log(Hive, spawnStateNode({ cat: 5 }, ["cats", (state, msg) => {
    return {
        ...state,
        cats: msg.payload
    };
}]));