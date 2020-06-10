import Hive from "./../lib/package";

console.log(Hive.spawnStateNode({ cat: 5 }, ["cats", (state, msg) => {
    return {
        ...state,
        cats: msg.payload
    };
}]));