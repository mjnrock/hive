import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Routes from "./routes/package";

import "tachyons/src/tachyons.css";
import "./css/grid.tachyons.css";
import "semantic-ui-css/semantic.min.css";
//! NOTE: The Tailwind final css file doesn't add entries unless it *explicitly* evaluates that option -- Tag coloring appears broken sometimes as a result of this
/**
 * A present workaround is to explicitly load each color that might be used, so that the entries are put into the final css file.
 * These are things like `hover:bg-${ colorLookup }-700`, where `hover:bg-tealXXX-700`/`hover:bg-greenXXX-700`/etc. need to be explicitly evaluated.
 * Typing these out by hand, letting the processor run, then reloading the page seems to solve this, but there has to be a built-in way to deal with this shit.
 * 
 * ?UPDATE: Apparently the processor looks *anywhere* for names, as the comments above triggered entries into the final css file -- perhaps exploit this?
 * 
 * Run this command to watch for CSS changes
 * npx tailwindcss -i ./src/css/input.tailwind.css -o ./src/css/tailwind.css --watch
 */
import "./css/tailwind.css";
import "./css/main.css";

export const Context = React.createContext();

function App() {
	return (
        <Context.Provider value={{ state: true }}>
            <Router>
                <Switch>
                    <Route path={ `/` }>
                        <Routes.Default />
                    </Route>
                </Switch>
            </Router>
        </Context.Provider>
	);
}

export default App;