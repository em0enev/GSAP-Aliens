import EventEmitter from "eventemitter3";
import gsap from "gsap/gsap-core";
import Saucer from "./Saucer";

export default class Cow extends EventEmitter {
    constructor() {
        super();
        this._cowElement = document.querySelector('.cow');
    }

    static get events() {
        return {
            ABDUCT_COMPLETE: 'abduct_completed'
        }
    }

    async moveTo() {
        await gsap.to(this._cowElement, {y: '-390px'});
        await this.hide();
    }

    async hide() {
        await gsap.to(this._cowElement, { opacity: 0, duration: 0})
        this.emit(Cow.events.ABDUCT_COMPLETE)
    }
}