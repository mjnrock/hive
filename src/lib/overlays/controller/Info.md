# `Controller`
A `Controller` is a type of `Overlay` that adds **Redux**-like functionality to a `Node`.  As such, the Overlay seed's `.state` entry is expected to be a `function` that will return a default `state`, while the pre-assigned `triggers` are intended to allow for invocations via event-messaging handlers.

The major reason for using a `Controller` is that their primary implementation purpose is to act as a stateful context with a application.  For example, in *React-Redux* analogy, a `Controller` would hold the `state`, the `dispatcher`, and the `reducers`.  This could then be coupled with a `React.Context` for application-wide use.

> `Hive` uses a `React.Context` with a `Controller` instance as the data, to allow for any component to access `Hive` *global* `state`, with the help of a `Router` to allow for domain-specific sub-`state` channels (e.g. *modules*).

## Digital Circuitry
By using a `Controller` with `triggers` (using `numbers` as keys, for example), it can mimick the structure of a circuit with ports (e.g. RaspberryPi, Arduino, etc.), and could be used to create flyweight (or more complex) circuit connectivity (via inter-`Node` linkages), similar to what one could do in *PlayStation's* **Dreams**.

#### **Example**

*state*

`{ current: 0 }`

*triggers*

|key|action|
|-|-|
|INC|`++state.current`|
|DEC|`--state.current`|

*invocation*

```
console.log("Pre", Controller.state);

Controller.invoke("INC");

console.log("Post", Controller.state);
```