export default {
    Encode: (input) => {
        if(input instanceof HTMLCanvasElement) {
            return input.toDataURL("image/png", 1.0);
        } else if(input instanceof HTMLImageElement) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = input.width;
            canvas.height = input.height;

            ctx.drawImage(input, 0, 0);
            
            return Base64.Encode(canvas);
        }
    
        return false;
    },

    Decode: async (input) => {
        return new Promise((resolve, reject) => {
            if(input instanceof HTMLCanvasElement || input instanceof HTMLImageElement) {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
        
                canvas.width = input.width;
                canvas.height = input.height;
        
                ctx.drawImage(input, 0, 0);

                resolve(canvas);
            } else {
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
            }
        });
    }
};