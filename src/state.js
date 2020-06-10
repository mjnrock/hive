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

export default StateNode;