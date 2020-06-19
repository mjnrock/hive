import Node from "./Node";

//* Use this file as a "file variable"
const StateNode = new Node({
    cats: 2
});
StateNode.addReducer("cats", (state, msg) => {
    return {
        ...state,
        cats: msg.payload
    };
})

export function spawnStateNode(state, reducers = [], effects = []) {
    const stateNode = new Node(state);

    for(let reducer of reducers) {
        if(Array.isArray(reducer)) {
            stateNode.addReducer(...reducer);
        } else if(typeof reducer === "function") {
            stateNode.addReducer(reducer);
        }
    }

    for(let effect of effects) {
        if(typeof effect === "function") {
            stateNode.addEffect(effect);
        }
    }

    return stateNode;
}

export default StateNode;