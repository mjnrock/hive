/* eslint-disable */
import { useContext, useState, useEffect } from "react";
import Node, { EnumEventType } from "./Node";

//* Only real requirement is that the Context.Provider contains a kvp of { node: <Node> }
export function useNodeContext(context) {
    const { node: ctxNode } = useContext(context);
    const [ state, setState ] = useState({
        node: ctxNode,
        state: ctxNode.state
    });

    useEffect(() => {
        const fn = (state, msg, node) => {            
            setState({
                node: ctxNode,
                state: ctxNode.state,
            });
        };

        ctxNode.addEffect(fn);

        return () => {
            ctxNode.removeEffect(fn);
        }

        // let componentNode = new Node();

        // componentNode.watchMessages(ctxNode);
        // componentNode.after = (state, msg, node) => {            
        //     setState({
        //         node: ctxNode,
        //         state: ctxNode.state,
        //     });
        // }

        // return () => {
        //     componentNode.unwatchMessages(ctxNode);
        //     componentNode.after = null;
        //     componentNode = null;
        // }
    }, []);

    return state;
};