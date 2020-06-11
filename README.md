## Methods
As a general rule, if the method is spelled in `camelCase`, then it is an internal, `this`-applicable method; if it is `ProperCase`, then it is a `static` method, and must be invoked via `ClassName.MethodName`.

### Package Exports
> `import Hive, { spawnStateNode, useNodeContext } from "@lespantsfancy/hive";`

|Import|Type|Parameters|Description|
|---|---|---|---|
|`*`|`default`|`none`|Used to perform any modifications before the `reducers` are called.  Contains `{ Message, Node, fn }`|
|`spawnStateNode`|`named`|`(state, ...reducers)`|This should be used as the `React:Context` itself.  e.g. `React.createContext(spawnStateNode(state, ...reducers)))`|
|`useNodeContext`|`named`|`(context)`|This should be used in place of any `useContext` call and will return `{ node, state }`|

### `Message`
> `new Message(type, payload, emitter, { id, timestamp });`

`id` and `timestamp` are automatically populated, and are really only there for de/serialization reasons.
|Method|Parameters|Description|
|---|---|---|
|`toJson`|`()`|Convert the `Message` into a json string.|
|`toObject`|`()`|Convert the `Message` into a basic `Object`.|
|`FromJson`|`(json|obj)`|Convert a `json string` or `Object` into a `Message`, provided it was previously serialized or contains the appropriate properties.|
|`Conforms`|`(obj)`|Check if `@obj` conforms to the *shape* of `Message`|
|`JsonConforms`|`(json)`|Check if `@json` conforms to the *shape* of `Message`|

### `Node`
> `new Node(state = {});`

`Node extends EventEmitter` and, as such, has all of the `.on`, `.off`, etc. methods available to it.  Two (2) events are prepopulated (`state` and `message`), which have native handlers.  The `EventEmitter` allows for multiple handlers, so you can have additional custom handlers to *any* event--including `state` and `message`--without direct consequences by that fact itself.
|Method|Parameters|Description|
|---|---|---|
|`.watchState`|`(node, ?twoWay)`|A node can watch the `state` event of another node by way of a `Message` sent to its `.onState` method (which is overwritable if needed, but probably shouldn't be).|
|`.watchMessages`|`(node, ?twoWay)`|A node can watch the `message` event of another node by way of a `Message` sent to its `.onMessage` method (which is overwritable if needed, but probably shouldn't be).|
|`.addReducer`|`(fn)|(type, fn)`|All `reducers` should return the new `state`.  If a `@type` is also specified, the reducer will only fire if `message.type === @type`.  If no `state` is returned, then the current `state` will be used; this allows for "viewing" methods to be injected without consequence [e.g. `.addReducer(console.log)`].|
|`.dispatch`|`(type, payload)`|Used to `.emit(EnumEventType.MESSAGE, new Message(type, payload, this));`|
|`.before`|`(state, message, node)`|Used to perform any modifications before the `reducers` are called.|
|`.after`|`(state, message, node)`|Used as a pseudo `useEffect` proxy, called after all of the `reducers` have run, immediately before the `state` has been altered.  As such, any effect will be caught by the rerender if using `useNodeContext`.|
|`.flatten`|`()`|This will convert the `this.state` into an array of [ dot notation, value ] arrays.  For example, if the `state = { cat: { count : 5 }, dog: "bob" }`, `.flatten` will return `[ [ "cat.count", 5 ], [ "dog", "bob" ] ]`.|
|`.unflatten`|`("flattened" array)`|This undoes `.flatten`.  An input of `[ [ "cat.count", 5 ], [ "dog", "bob" ] ]` will return `{ cat: { count : 5 }, dog: "bob" }` ***AND*** *set `this.state`* to the newly-created object.|

### Example Usage
```
import React from "react";
import { spawnStateNode, useNodeContext } from "@lespantsfancy/hive";

const initStateNode = spawnStateNode({ cats: 0 }, [
    "cats",
    (state, msg, node) => {
        return {
            ...state,
            cats: state.cats + 1
        };
    }
]);

export const Context = React.createContext(initStateNode);

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
        <Context.Provider value={{ node: initStateNode }}> {/* sic */}
            <SubComponent />
            <SubComponent />
            <SubComponent />
        </Context.Provider>
    );
};
```