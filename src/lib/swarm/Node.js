import { v4 as uuid } from "uuid";

export class Node {
	constructor({ id, state = {}, mesh = [], config = {}, triggers = [], tags = [] } = {}) {
		this._id = id || uuid();
		this._state = state;
		this._triggers = new Map(...triggers);
		this._mesh = new Set(...mesh);
		this._config = {
			isReducer: true,
			queue: new Set(),
			isBatchProcessing: false,
			maxBatchSize: 1000,

			...config,
		};
		this._tags = new Set(...tags);
	}

	get id() {
		return this._id;
	}

	get state() {
		return this._state;
	}
	set state(state = {}) {
		this._state = state;

		return this;
	}

	get triggers() {
		return this._triggers;
	}
	set triggers(triggers) {
		this._triggers = new Map(...triggers);

		return this;
	}

	get mesh() {
		return this._mesh;
	}
	set mesh(mesh) {
		this._mesh = new Set(...mesh);

		return this;
	}

	get config() {
		return this._config;
	}
	set config(config = {}) {
		this._config = config;

		return this;
	}

	get tags() {
		return this._tags;
	}
	set tags(tags = []) {
		const [ add, remove ] = tags;

		if(Array.isArray(add)) {
			for(let a of add) {
				this._tags.add(a);
			}
		}
		if(Array.isArray(remove)) {
			for(let r of remove) {
				this._tags.delete(r);
			}
		}

		return this;
	}

	enmesh(node) {
		this._mesh.add(node);

		return this;
	}
	demesh(node) {
		return this._mesh.delete(node);
	}

	receive(trigger, ...args) {
		this.exec(trigger, ...args);

		return this;
	}
	broadcast(trigger, ...args) {
		for(let node of this._mesh) {
			if(node !== this) {
				node.receive(trigger, ...args);
			}
		}

		return this;
	}


	/**
	 * @trigger can be anything, not limited to strings
	 */
	addTrigger(trigger, handler) {
		let handlers = this._triggers.get(trigger);

		if(!(handlers instanceof Set)) {
			let value = new Set();
			this._triggers.set(trigger, value);
			handlers = value;
		}

		handlers.add(handler);

		return this;
	}
	addTriggers(addTriggerArgs = []) {
		for(let args of addTriggerArgs) {
			this.addTrigger(...args);
		}

		return this;
	}
	removeTrigger(trigger, handler) {
		let handlers = this._triggers.get(trigger);

		if(handlers instanceof Set) {
			return handlers.delete(handler);
		}

		return false;
	}
	removeTriggers(removeTriggerArgs = []) {
		let results = [];
		for(let args of removeTriggerArgs) {
			results.push(this.removeTrigger(...args));
		}

		return results;
	}

	process(qty = this._config.maxBatchSize) {
		const queue = [ ...this._config.queue ];
		const results = [];
		const runSize = Math.min(qty, this._config.maxBatchSize);

		for(let i = 0; i < runSize; i++) {
			const [ trigger, args ] = queue[ i ];

			results.push(this.run(trigger, ...args));
		}

		this._config.queue = new Set(queue.slice(runSize));

		return results;
	}
	run(trigger, ...args) {
		let hadMatch = false;
		for(let [ trig, fns ] of this._triggers) {
			if(trigger === trig) {
				hadMatch = true;
				/**
				 * "state" handlers won't reduce, but could theoretically use
				 * this._state directly, if needed
				 */
				if(this.config.isReducer === true && trigger !== "state") {
					let next;
					for(let fn of fns) {
						next = fn(args, { trigger, node: this });
					}

					const oldState = this._state;
					this._state = next;

					this.exec("state", { current: this._state, previous: oldState });
				} else {
					for(let fn of fns) {
						fn(args, { trigger, node: this });
					}
				}
			}
		}

		if(hadMatch === false) {
			if(typeof this[ trigger ] === "function") {
				this[ trigger ](...args);

				hadMatch = true;
			}
		}

		return hadMatch;
	}
	exec(trigger, ...args) {
		if(this._config.isBatchProcessing === true) {
			this._config.queue.add([ trigger, args ]);

			return true;
		}

		return this.run(trigger, ...args);
	}

	deconstructor() {}
};

export default Node;