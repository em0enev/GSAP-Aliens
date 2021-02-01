import EventEmitter from "eventemitter3"
import Cow from "./Cow";
import Saucer from "./Saucer";

export default class Animation extends EventEmitter {
    constructor(){
        super();
        this.cow = new Cow();
        this.saucer = new Saucer(this.cow);
    }

    async start(){
        this.saucer.on(Saucer.events.FLY_IN, async () => await this.saucer.toggleBeam());
        this.saucer.on(Saucer.events.BEAM_SHOW, async () => await this.cow.moveTo())
        await this.saucer.moveTo();
    }

}