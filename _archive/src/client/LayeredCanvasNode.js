import GridCanvasNode from "./GridCanvasNode";

export const EnumMessageType = {
    PAINT: "LayeredCanvasNode.Paint",
};

export default class LayeredCanvasNode extends GridCanvasNode {
    constructor({ state = {}, config = {}, width, height, size, stack = [] } = {}) {
        super({ state, config, width, height, size });

        if(Array.isArray(stack[ 0 ]) && stack[ 0 ].length === 2) {
            this.mergeState({
                stack: new Map(stack)
            });
        } else if(Array.isArray(stack)) {
            this.mergeState({
                stack: new Map(stack.map((m, i) => [ i, m ]))
            });
        } else if(Number.isInteger(stack)) {
            for(let i = 0; i < stack; i++) {
                this.addLayer({ width, height, size });
            }
        }
    }

    get stack() {
        return this.state.stack;
    }
    set stack(stack) {
        if(Array.isArray(stack[ 0 ]) && stack[ 0 ].length === 2) {
            this.mergeState({
                stack: new Map(stack)
            });
        } else if(Array.isArray(stack)) {
            this.mergeState({
                stack: new Map(stack.map((m, i) => [ i, m ]))
            });
        }
    }
    get stackSize() {
        return this.stack.length;
    }

    getLayer(nameOrIndex = 0) {
        return this.stack.get(nameOrIndex);
    }
    addLayer({ layer, name, state = {}, config = {}, width, height, size }) {
        if(layer instanceof CanvasNode) {
            this.stack.set(name, layer);
        } else {
            this.stack.set(name || this.stackSize, new GridCanvasNode({ state, config, width, height, size }));
        }

        return this;
    }
    removeLayer(nameOrIndex) {
        this.stack.delete(nameOrIndex);

        return this;
    }

    swapLayers(firstNameOrIndex, secondNameOrIndex) {
        const temp = this.stack.get(firstNameOrIndex);

        this.stack.set(firstNameOrIndex, this.stack.get(secondNameOrIndex));
        this.stack.set(secondNameOrIndex, temp);

        return this;
    }

    paint(...drawImageArgs) {
        if(!drawImageArgs.length) {
            drawImageArgs = [ 0, 0 ];
        }
        
        this.stack.forEach(cnode => this.ctx.drawImage(cnode.canvas, ...drawImageArgs));

        this.dispatch(EnumMessageType.PAINT);

        return this;
    }
    paintLayer(nameOrIndex = 0, ...drawImageArgs) {
        const layer = this.getLayer(nameOrIndex);

        if(layer) {
            if(!drawImageArgs.length) {
                drawImageArgs = [ 0, 0 ];
            }

            this.ctx.drawImage(layer.canvas, ...drawImageArgs);
            
            this.dispatch(EnumMessageType.PAINT);
        }

        return this;
    }
}