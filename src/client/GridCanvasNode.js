import CanvasNode from "./CanvasNode";

export const EnumMessageType = {};

/**
 * If a method is preceded be "g", then arg ∈ { X, Y, Width, Height } should be considered TILE entries
 * For Example: if rect(25,25,50,50) and tiles are 25x25, then gRect(1,1,2,2)
 */
export default class GridCanvasNode extends CanvasNode {
    constructor({ state = {}, config = {}, width, height, size, draw } = {}) {
        super({ state, config, width, height });

        this.mergeState({
            tile: {
                width: size[ 0 ],
                height: size[ 1 ],
            }
        });

        if(typeof draw === "function") {
            this.draw = draw.bind(this);
        }
    }

    get tw() {
        return this.state.tile.width;
    }
    get th() {
        return this.state.tile.height;
    }

    get xqty() {
        return this.canvas.width / this.tw;
    }
    get yqty() {
        return this.canvas.height / this.th;
    }

    resizeTile(tw, th) {
        if(Number.isInteger(tw) && Number.isInteger(th)) {
            this.mergeState({
                tile: {
                    width: tw,
                    height: th,
                }
            });
        }

        return this;
    }

    /**
     * 
     * @param {string|number} round "floor"|"ceil"|/[0-9]/
     */
    pixelToGrid(xs = [], ys = [], { round = 0, asArray = false } = {}) {
        if(String(round).match(/[0-9]/)) {
            xs = xs.map(x => parseFloat(x).toFixed(round));
            ys = ys.map(y => parseFloat(y).toFixed(round));
        } else if(round in Math) {
            xs = xs.map(x => Math[ round ](x));
            ys = ys.map(y => Math[ round ](y));
        }
        
        const tx = xs.map(x => this.tw * x);
        const ty = ys.map(y => this.th * y);

        if(asArray === true) {
            return [
                tx,
                ty
            ];
        }

        return {
            x: tx,
            y: ty,
        };
    }

    draw() {}
    drawGrid({ fillStyle = "#000" } = {}) {
        this.prop({ fillStyle });

        for(let x = 0; x < this.xqty; x++) {
            for(let y = 0; y < this.yqty; y++) {
                this.gRect(
                    x,
                    y,
                    1,
                    1,
                    { isFilled: false }
                )
            }
        }
    }
    drawTransparency() {    
        let iter = 0;
        for (let x = 0; x < this.canvas.width; x += this.tw / 2) {
            for (let y = 0; y < this.canvas.height; y += this.th / 2) {
                this.ctx.fillStyle = (iter % 2 === 0) ? "#fcfcfc" : "#f5f5f5";
                this.ctx.fillRect(x, y, this.tw, this.th);
                ++iter;
            }
            ++iter;
        }
    }
    
    //* Grid ("g") Shape Methods
    /*
     *  All ctx modifications (e.g. color, stroke width, etc.) should be changed via .prop
     */
    gErase(x, y, w, h, { round = 0 } = {}) {
        const [[ tx, tw ], [ ty, th ]] = this.pixelToGrid([ x, w ], [ y, h ], { round, asArray: true });

        this.erase(tx, ty, tw, th);

        return this;
    }

    gPoint(x, y, { round } = {}) {
        return this.gRect(x, y, 1, 1, { isFilled: true, round });
    }
    gRect(x, y, w, h, { isFilled = false, round } = {}) {
        const [[ tx, tw ], [ ty, th ]] = this.pixelToGrid([ x, w ], [ y, h ], { round, asArray: true });

        this.rect(tx, ty, tw, th, { isFilled });

        return this;
    }
    gCircle(x, y, r, { isFilled = false, round } = {}) {
        const [[ tx ], [ ty ]] = this.pixelToGrid([ x ], [ y ], { round, asArray: true });
        
        this.circle(tx, ty, r, { isFilled });

        return this;
    }

    gTile(imageOrSrc, sx, sy, dx, dy, { round } = {}) {
        const [[ tsx, tdx ], [ tsy, tdy ]] = this.pixelToGrid([ sx, dx ], [ sy, dy ], { round, asArray: true });

        this.image(imageOrSrc, tsx, tsy, this.tw, this.th, tdx, tdy, this.tw, this.th);

        return this;
    }

    gQuilt(x, y, w, h, { round, colorFn } = {}) {
        this.ctx.save();
        for(let i = 0; i < w; i++) {
            for(let j = 0; j < h; j++) {
                let color;

                if(typeof colorFn === "function") {
                    color = colorFn({ x: x + i, y: y + j, i, j }, { tx: x, ty: y, w, h });
                } else {
                    color = `rgb(${ ~~(Math.random() * 255) }, ${ ~~(Math.random() * 255) }, ${ ~~(Math.random() * 255) })`;
                }

                this.prop({
                    fillStyle: color,
                });

                this.gPoint(x + i, y + j);
            }
        }
        this.ctx.restore();
    }
}