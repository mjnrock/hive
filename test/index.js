import { spawnStateNode } from "./../lib/package";

console.log(spawnStateNode({ cat: 5 }, ["cats", (state, msg) => {
    return {
        ...state,
        cats: msg.payload
    };
}]));