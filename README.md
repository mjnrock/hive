### Example Usage
```
import Hive from "@lespantsfancy/hive";
import { useNodeContext } from "@lespantsfancy/hive/lib/hooks";
// The StateNode default export is a demo state, use { spawnStateNode } to customize
import StateNode from "@lespantsfancy/hive/lib/state";

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