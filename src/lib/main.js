//TODO Convert the Router and Controller to Overlays
//TODO Make a "TagCompound System" Controller to perform all relevant commands on a TagCompound (and to recursively call itself when appropriate)

import Console from "./util/Console";

import Controller from "./event/Controller";
import Router from "./event/Router";

import TagControllerFactory from "./controllers/Tag";

console.log(TagControllerFactory(5).map(v => v.state.id));