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

export function spawnStateNode(state, ...reducers) {
    const stateNode = new Node(state);

    for(let reducer of reducers) {
        if(Array.isArray(reducer)) {
            stateNode.addReducer(...reducer);
        } else if(typeof reducer === "function") {
            state.addReducer(reducer);
        }
    }

    return stateNode;
}

export default StateNode;