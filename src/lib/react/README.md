# Read Me
For now, all that is actually needed for `React` hooks are the functionality wrappers.  As such, there are **two (2)** hooks available:
 * `useNode`
 * `useContextNode`

---

## `useNode`


`useNode(node) => ({ state, update, dispatch, node })`

This assumes that the `Node` being passed will act as a **State Node** for React in a Redux-like capacity.  As such, you can call upon the reducer stack directly via the `update` function, or simply invoke a message via `dispatch`.

**Note:**
The `dispatch` trigger handler must invoke the `update` trigger directly in order for a dispatched message to invoke a state change.  Functionally, this means that a handler should, immediately before returning, invoke the `update` trigger (which is passed as a convenience function, as shown below):

```
const triggerHandler = ({ target: node, update }) => (...args) => {
	...

	update(...updateArgs);	// node.actions.invoke("update", ...updateArgs);

	return <any>;
}
```

---

## `useContextNode`
`useNode(context, prop) => ({ state, update, dispatch, node })`

The only reason to prefer this to `useNode` is for cases where the **State Node** is *not* the root value of a `React.Context`.  For example, the **State Node** is a value in a nested object.

This uses `useNode` under the hood, once it has parsed the `@context` object to the endpoint declared by `@prop`.  It thus expects to find a `Node`, and will send that to `useNode`.