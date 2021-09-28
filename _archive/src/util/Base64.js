import isBase64 from "is-base64";

export default {
    // If successful, will return a base64 string with mime, else false
    Encode: (input, quality = 1.0) => {
        return new Promise((resolve, reject) => {
            try {
                if(input instanceof HTMLCanvasElement) {
                    resolve(input.toDataURL("image/png", quality));
                } else if(input instanceof HTMLImageElement) {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
        
                    canvas.width = input.width;
                    canvas.height = input.height;
        
                    ctx.drawImage(input, 0, 0);
                    
                    resolve(Base64.Encode(canvas, quality));
                } else if(isBase64(input, { mimeRequired: true })) {
                    resolve(input);
                } else {
                    resolve(false);
                }
            } catch(e) {
                reject(e);
            }
        });
    },

    // If successful, will return a resolve(<canvas>), else will reject(@input)
    Decode: async (input) => {
        return new Promise((resolve, reject) => {
            try {
                if(input instanceof HTMLCanvasElement || input instanceof HTMLImageElement) {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
            
                    canvas.width = input.width;
                    canvas.height = input.height;
            
                    ctx.drawImage(input, 0, 0);
    
                    resolve(canvas);
                } else if(isBase64(input, { mimeRequired: true })) {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
            
                    const img = new Image();
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
            
                        ctx.drawImage(img, 0, 0);
            
                        resolve(canvas);
                    }
                    img.src = input;
                } else {
                    reject(input);
                }
            } catch(e) {
                reject(e);
            }
        });
    }
};