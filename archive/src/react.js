/* eslint-disable */
import { useContext, useState, useEffect } from "react";

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
    }, []);

    return state;
};