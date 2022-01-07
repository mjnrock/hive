import Controller from "./Controller";

export class Router {
	constructor({ routes = [], hooks = {}, isMultiMatch = false } = {}) {
		this.routes = new Map(routes);

		this.hooks = {
			pre: false,
			post: false,
			each: false,
			...hooks,
		};
		this.isMultiMatch = isMultiMatch;
	}

	/**
	 * If the @route function returns << true >>, then execute @controller
	 * @param {fn} route 
	 * @param {Controller} controller 
	 * @returns this
	 */
	addRoute(route, controller) {
		if(typeof route === "function" && controller instanceof Controller) {
			this.routes.set(route, controller);
		}

		return this;
	}
	/**
	 * An iterative execution option of << this.addRoute >>
	 * @param {Map} routes 
	 * @returns this
	 */
	addRoutes(routes) {
		for(let [ route, controller ] of Object.entries(routes)) {
			this.routes.set(route, controller);
			if(typeof route === "function" && controller instanceof Controller) {
				this.routes.set(route, controller);
			}
		}

		return this;
	}

	hasTrigger(trigger) {
		for(let controller of this.routes.values()) {
			if(controller.handlers.has(trigger)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Execute << .invoke >> on the relevent <Controller(s)>
	 * @param {fn} trigger Must return << true >> in order to execute the <Controller>
	 * @param  {...any} args
	 * @returns 
	 */
	route(trigger, ...args) {
		let configShortCircuit = false;

		if(typeof this.hooks.pre === "function") {
			let filterResult = this.hooks.pre(trigger, ...args);

			if(filterResult === false) {
				return;
			}
		}

		let finalResult;
		this.routes.forEach((controller, route) => {
			if(configShortCircuit) {
				return this;
			}

			if(route(trigger) === true) {
				let result = controller.invoke(trigger, ...args);

				if(typeof this.hooks.each === "function") {
					this.hooks.each(result, controller.state, trigger, args);
				}

				finalResult = result;

				configShortCircuit = !this.isMultiMatch;
			}
		});

		if(typeof this.hooks.post === "function") {
			this.hooks.post(trigger, ...args);
		}

		return finalResult;
	}
};

export const Triggers = {
	Loose(input) {
		return trigger => trigger == input;
	},
	Equals(type) {
		return trigger => trigger === type;
	},
	Includes(types = []) {
		return trigger => types.includes(trigger);
	},
	Match(regex) {
		return trigger => regex.test(trigger.toString());
	},
};

export default Router;