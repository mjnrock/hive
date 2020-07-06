import GridCanvasNode from "./GridCanvasNode";

export const EnumMessageType = {
    PAINT: "LayeredCanvasNode.Paint",
};

export default class LayeredCanvasNode extends GridCanvasNode {
    constructor({ state = {}, config = {}, width, height, size, stack = [] } = {}) {
        super({ state, config, width, height, size });

        this.mergeState({
            stack: stack
        });

        if(Number.isInteger(stack)) {
            for(let i = 0; i < stack; i++) {
                this.addLayer({ width, height, size });
            }
        }
    }

    get stack() {
        return this.state.stack;
    }
    set stack(stack) {
        this.mergeState({
            stack: stack,
        });
    }
    get stackSize() {
        return this.stack.length;
    }

    addLayer({ state = {}, config = {}, width, height, size }) {
        this.stack.push(new GridCanvasNode({ state, config, width, height, size }));

        return this;
    }
    removeLayer(index) {
        this.stack.splice(index, 1);

        return this;
    }

    getLayer(index = 0) {
        return this.stack[ index ];
    }

    swapLayers(first, second) {
        const temp = this.stack[ first ];
        this.stack[ first ] = this.stack[ second ];
        this.stack[ second ] = temp;

        return this;
    }

    paint() {
        this.stack.forEach(cnode => this.ctx.drawImage(cnode.canvas, 0, 0));

        this.dispatch(EnumMessageType.PAINT);

        return this;
    }
}