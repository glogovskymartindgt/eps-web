export class FileManager {
    private readonly _input: HTMLInputElement;
    private readonly _link: HTMLAnchorElement;

    public constructor() {
        this._input = document.createElement('input');
        this._input.setAttribute('type', 'file');
        this._input.setAttribute('value', 'files');
        this._input.setAttribute('multiple', '');
        this._input.setAttribute('class', 'hide');

        this._link = document.createElement('a');
        this._link.setAttribute('class', 'hide');
        this._link.setAttribute('href', '');
    }

    public saveFile(name, text, type = 'text/plain'): void {
        document.body.appendChild(this._link);
        this._link.href = URL.createObjectURL(new Blob([text], {type}));
        this._link.download = name;
        this._link.click();
        document.body.removeChild(this._link);
    }

    public saveImage(name, image): void {
        document.body.appendChild(this._link);
        this._link.href = typeof image === 'string' ? image : image.src;
        this._link.download = name;
        this._link.click();
        document.body.removeChild(this._link);
    }

    public saveImageByNameAndSource(name, src): void {
        document.body.appendChild(this._link);
        this._link.href = src;
        this._link.download = name;
        this._link.click();
        document.body.removeChild(this._link);
    }

    public loadImage(func): void {
        this.onFileChange((files: File[]) => {
            const reader = new FileReader();
            reader.onload = () => {
                const image = new Image();
                image.src = reader.result as string;
                this._input.value = null;
                func(image, files[0]);
            };
            reader.readAsDataURL(files[0]);
        });
    }

    public loadImages(func): void {
        this.onFileChange((files: File[]) => {
            const promises = [];
            for (const file of files) {
                promises.push(new Promise((success, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const image = new Image();
                        image.src = reader.result as string;
                        success({image, file});
                    };
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(file);
                }));
            }
            Promise.all(promises).then((data) => {
                this._input.value = null;
                func(data);
            }).catch((error) => {
                throw new Error('Cannot upload files: ' + error.message);
            });
        });
    }

    public loadFile(func): void {
        this._input.onchange = (e: any) => {
            const reader = new FileReader();
            reader.onload = () => func(reader.result);
            reader.readAsText(e.target.files[0]);
        };
        this._input.click();
    }

    public loadBinaryFile(func): void {
        this._input.onchange = (event: any) => {
            const reader = new FileReader();
            const files = event.target.files;
            if (files.length > 0) {
                reader.onload = () => func(reader.result, files[0].name);
                reader.readAsBinaryString(files[0]);
            }
        };
        this._input.click();
    }

    private onFileChange(callback: (files: File[]) => void): void {
        this._input.onchange = (event: any) => {
            const files = event.target.files;
            if (files.length > 0) {
                callback(files);
            }
        };
        this._input.click();
    }
}
