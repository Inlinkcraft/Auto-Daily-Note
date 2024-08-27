
export class Timer {

    time:number

    constructor(timeText:string) {

        let mult:number = Number.parseFloat(timeText);
        let cate:string = timeText.replace(/[0-9]/g, '');

        switch (cate) {

            case "m": {
                this.time = mult * 1;
                break;
            }

            case "h": {
                this.time = mult * 1 * 60;
                break;
            }

            case "d": {
                this.time = mult * 1 * 60 * 24;
                break;
            }

            case "w": {
                this.time = mult * 1 * 60 * 24 * 7;
                break;
            }

            case "mo": {
                this.time = mult * 43800;
                break;
            }

            case "y": {
                this.time = mult * 1 * 60 * 24 * 7 * 52;
                break;
            }

            default: {
                throw SyntaxError("Invalid time")
            }

        }

    }

}