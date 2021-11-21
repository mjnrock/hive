import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Routes from "./routes/package";

import "tachyons/src/tachyons.css";
import "./css/grid.tachyons.css";
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