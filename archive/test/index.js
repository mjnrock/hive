import { spawnStateNode } from "./../lib/package";



const StateNode = spawnStateNode({
    canvas: {
        width: null,
        height: null,
        ref: null,
    },
    image: {
        width: null,
        height: null,
        ref: null,
    },
    tile: {
        width: null,
        height: null,
    },

    frames: {},
});

StateNode.addFrame = function(x, y, image) {
    this.state = {
        ...this.state,
        frames: {
            ...this.state.frames,
            [ `${ x }.${ y }` ]: image
        }
    };
};
StateNode.onState = console.log;

StateNode.addFrame(0, 0, "cat");

// console.log(StateNode.state);