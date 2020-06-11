/* eslint-disable */
import { useContext, useState, useEffect } from "react";
import Node from "./Node";

//* Only real requirement is that the Context.Provider contains a kvp of { node: <Node> }
export function useNodeContext(context) {
    const { node: ctxNode } = useContext(context);
    const [ state, setState ] = useState({
        node: ctxNode,
        state: ctxNode.state
    });

    useEffect(() => {
        const componentNode = new Node();

        componentNode.watchMessages(ctxNode);
        componentNode.after = (state, msg, node) => {
            setState({
                node: node,
                state: node.state,

                newState: state,
                oldState: node.state,
                lastMessage: msg,
            });
        }

        return () => componentNode.unwatchMessages(ctxNode);
    }, []);

    return state;
};