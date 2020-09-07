import Node from "./../Node";

export const EnumMessageType = {
    RENDER: "CanvasNode.Render",
};

export default class CanvasNode extends Node {
    constructor({ state = {}, config = {}, width, height, canvas } = {}) {
        super({
            canvas: canvas || document.createElement("canvas"),
            images: {},
            
            ...state,
        });

        this.mergeConfig({
            normalization: {
                arc: -Math.PI / 4,
            },
            isPlaying: false,
            lastTimestamp: 0,
            fps: 0,
            
            ...config,
        });

        this.resize(width, height);
    }

    get canvas() {
        return this.state.canvas;
    }
    set canvas(canvas) {
        return this.mergeState({
            canvas,
        });
    }
    get ctx() {
        return this.state.canvas.getContext("2d");
    }

    get width() {
        return this.canvas.width;
    }
    set width(value) {
        this.canvas.width = value;
    }
    
    get height() {
        return this.canvas.height;
    }
    set height(value) {
        this.canvas.height = value;
    }

    get center() {
        return [
            this.width / 2,
            this.height / 2
        ];
    }

    img(key) {
        return this.images[ key ];
    }
    get images() {
        return this.state.images;
    }

    get fps() {
        return this.config.fps;
    }
    set fps(fps) {
        this.config.fps = fps;
    }

    resize(width, height) {
        if(Number.isInteger(width) && Number.isInteger(height)) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        return this;
    }

    //* "Chainable" abstractions to allow a series of calls to be made before a context reset
    begin() {
        this.ctx.save();

        return this;
    }
    end() {
        this.ctx.restore();

        return this;
    }

    //* Context meta methods
    prop(obj = {}) {
        for(let [ key, value ] of Object.entries(obj)) {
            this.ctx[ key ] = value;
        }

        return this;
    }

    loadImage(name, imageOrSrc) {
        return new Promise((resolve, reject) => {
            if(imageOrSrc instanceof HTMLImageElement) {
                this.state.images[ name ] = imageOrSrc;

                resolve(this);
            } else if(typeof imageOrSrc === "string" || imageOrSrc instanceof String) {
                let img = new Image();
                img.onload = e => {
                    this.state.images[ name ] = img;

                    resolve(this);
                }
                img.src = imageOrSrc;
            } else {
                reject(this);
            }

            return this;
        });
    }
    loadImages(arr = []) {
        let promises = [];

        for(let imgArr of arr) {
            promises.push(this.loadImage(...(imgArr || [])));
        }

        return Promise.all(promises);
    }

    play() {
        this.config.isActive = true;
        this.render();
    }
    pause() {
        this.config.isActive = false;
    }
    
    render() {
        if(this.config.isActive === true) {
            window.requestAnimationFrame((ts) => {                
                const dt = Math.min(ts - this.config.lastTimestamp, 1000 / 10);   // Create a 10fps floor

                this.onRender(dt);

                this.dispatch(EnumMessageType.RENDER, {
                    timestamp: ts,
                    delta: dt,
                    canvas: this.canvas,
                    ctx: this.ctx,
                });

                this.config.fps = 1000 / dt;
                this.config.lastTimestamp = ts;
                
                this.render();
            });
        }
    }
    onRender(dt) {}

    // Get a stream of the current canvas
    getStream(fps = 10) {
        return this.canvas.captureStream(fps);
    }

    copyTo(canvas) {
        this.ctx.drawImage(this.canvas, 0, 0);

        return canvas;
    }

    //* HTML Element Drawing
    drawCanvas(canvas) {
        this.ctx.drawImage(canvas, 0, 0);
        
        return this;
    }
    drawVideo(video) {
        this.ctx.drawImage(video, 0, 0);
        
        return this;
    }
    drawImage(video) {
        this.ctx.drawImage(video, 0, 0);
        
        return this;
    }

    //* Erasure methods
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        return this;
    }
    erase(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);

        return this;
    }
    eraseNgon(n, x, y, r, { rotation = 0 } = {}) {
        let pColor = this.ctx.strokeStyle;
        let pBgColor = this.ctx.fillStyle;

        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.fillStyle = "#fff";
        this.ngon(n, x, y, r, { rotation, isFilled: true });

        // Reset the composite and revert color
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.strokeStyle = pColor;
        this.ctx.fillStyle = pBgColor;
    }

    degToRad(...degrees) {
        if(degrees.length > 1) {
            const arr = [];

            for(let deg of degrees) {
                arr.push((deg * Math.PI / 180) + this.config.normalization.arc);
            }

            return arr;
        }

        return (degrees[ 0 ] * Math.PI / 180) + this.config.normalization.arc;
    }
    radToDeg(...radians) {
        if(radians.length > 1) {
            const arr = [];

            for(let rad of radians) {
                arr.push((rad + this.config.normalization.arc) * 180 / Math.PI);
            }

            return arr;
        }

        return (radians[ 0 ] + this.config.normalization.arc) * 180 / Math.PI;
    }

    //* Shape methods
    arc(x, y, r, s = 0, e = Math.PI * 2, { isFilled = false } = {}) {
        if(isFilled) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, s + this.config.normalization.arc, e + this.config.normalization.arc);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, s + this.config.normalization.arc, e + this.config.normalization.arc);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        return this;
    }

    circle(x, y, r, { isFilled = false } = {}) {
        if(isFilled) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        return this;
    }

    point(x, y) {
        return this.rect(x, y, 1, 1);
    }

    line(x0, y0, x1, y1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.closePath();
        this.ctx.stroke();

        return this;
    }

    rect(x, y, w, h, { isFilled = false } = {}) {
        this.ctx.beginPath();
        if(isFilled) {
            this.ctx.fillRect(x, y, w, h);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.rect(x, y, w, h);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        return this;
    }

    square(x, y, { rc = null, rw = null, isFilled = false } = {}) {
        if(rc !== null) {
            this.rect(x, y, 2 * rc * Math.cos(Math.PI / 4), 2 * rc * Math.sin(Math.PI / 4), { isFilled });
        } else if(rw !== null) {
            this.rect(x, y, 2 * rw, 2 * rw, { isFilled });
        }
    }

    _getNgonCorner(x, y, r, i, v, rot = 0) {
        let deg = (360 / v) * i + rot;
        let rad = (Math.PI / 180) * deg;

        return [
            x + r * Math.cos(rad),
            y + r * Math.sin(rad),
        ];
    }
    ngon(n, x, y, r, { isFilled = false, rotation = 0 } = {}) {
        let corners = [];
        for (let i = 0; i < n; i++) {
            corners.push(this._getNgonCorner(x, y, r, i, n, rotation));
        }

        this.ctx.beginPath();
        this.ctx.moveTo(...corners[ 0 ]);
        corners.forEach((c, i) => {
            if(i < corners.length - 1) {
                this.ctx.lineTo(...corners[i + 1]);
            }
        });
        this.ctx.lineTo(...corners[ 0 ]);
        this.ctx.closePath();

        if(isFilled) {
            // this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.ctx.stroke();
        }

        return this;
    }

    triangle(p0 = [], p1 = [], p2 = []) {
        if(arguments.length === 6) {
            p0 = [ arguments[ 0 ], arguments[ 1 ] ];
            p1 = [ arguments[ 2 ], arguments[ 3 ] ];
            p2 = [ arguments[ 4 ], arguments[ 5 ] ];
        }

        this.line(...p0, ...p1);
        this.line(...p1, ...p2);
        this.line(...p2, ...p0);

        return this;
    }

    text(txt, x, y, { align = "center", color = "#000", font = "10pt mono" } = {}) {
        let xn = x,
            yn = y;

        if(align) {
            this.ctx.textAlign = align;
            this.ctx.textBaseline = "middle";
        }

        let pColor = this.ctx.fillStyle;
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.fillText(txt, xn, yn);
        this.ctx.fillStyle = pColor;

        return this;
    }

    image(imageOrSrc, ...args) {
        return new Promise((resolve, reject) => {
            if(imageOrSrc instanceof HTMLImageElement || imageOrSrc instanceof HTMLCanvasElement) {
                // Synchronously draw if <img> or <canvas>
                this.ctx.drawImage(imageOrSrc, ...args);

                resolve(this);
            } else if(typeof imageOrSrc === "string" || imageOrSrc instanceof String) {
                if(imageOrSrc in this.images) {
                    // Synchronously draw if @imageOrSrc is a key in this.images (i.e. a cached image)

                    this.ctx.drawImage(this.images[ imageOrSrc ], ...args);
                } else {
                    // Asynchronously draw if @imageOrSrc is a "src" string
                    let img = new Image();
                    img.onload = e => {
                        this.ctx.drawImage(img, ...args);
    
                        resolve(this);
                    }
                    img.src = imageOrSrc;
                }
            } else {
                reject(this);
            }

            return this;
        });
    }

    tile(imageOrSrc, size, sx, sy, dx, dy) {
        this.image(imageOrSrc, sx, sy, size, size, dx, dy, size, size);

        return this;
    }
}