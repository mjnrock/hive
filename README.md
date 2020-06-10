### Example Usage
```
import Hive, { spawnStateNode, useNodeContext } from "@lespantsfancy/hive";

export const Context = React.createContext(StateNode);

function SubComponent(props) {
    const { node, state } = useNodeContext(Context);
    
    return (
        <div>
            <div>Cats: { state.cats }</div>
            <button onClick={ e => node.dispatch("cats", state.cats + 1 )}>Click Me</button>
        </div>
    )
}


export default function App() {
    return (
        <Context.Provider value={{ node: StateNode }}>
            <SubComponent />
            <SubComponent />
            <SubComponent />
        </Context.Provider>
    );
};
```