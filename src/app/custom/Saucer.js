import EventEmitter from "eventemitter3";
import gsap from "gsap/gsap-core";
import { Timeline } from "gsap/gsap-core";
import Cow from "./Cow";

export default class Saucer extends EventEmitter {
    constructor(cow) {
        super();
        this.cow = cow
        this._saucerElement = document.querySelector('.saucer')
        this._beamTopElement = document.querySelector('#beam-top');
        this._beamBottomElement = document.querySelector('#beam-bottom');
    }

    static get events() {
        return {
            FLY_IN: 'fly_in',
            FLY_AWAY: 'fly_away',
            BEAM_SHOW: 'beam_show',
            BEAM_HIDE: 'beam_hide'
        }
    }

    async moveTo() {
        const tl = new Timeline();
        await this._moveIn(tl);
        this.cow.on(Cow.events.ABDUCT_COMPLETE, async () => await this._moveOut(tl))
    }

    async toggleBeam() {
        const tl = gsap.timeline();
        this.cow.on(Cow.events.ABDUCT_COMPLETE, async () => await this._toggleBeamOff(tl))
        this._toggleBeamOn(tl)
    }

    async _moveIn(tl) {
        await tl.to(this._saucerElement, { x: '-835px', duration: 0.5 })
        await tl.pause();
        this.emit(Saucer.events.FLY_IN)
    }

    async _moveOut(tl) {
        tl.resume();
        await tl.to(this._saucerElement, { x: '-1800px' })
        this.emit(Saucer.events.FLY_AWAY)
    }

    async _toggleBeamOn(tl) {
        await tl.to(this._beamTopElement, { x: '-835px', opacity: 0.6, duration: 0 })
            .to(this._beamBottomElement, { x: '-835px', opacity: 0.6, duration: 0 }, '<')
        this.emit(Saucer.events.BEAM_SHOW)
    }

    async _toggleBeamOff(tl) {
        await tl.reverse();
        this.emit(Saucer.events.BEAM_HIDE)
    }
}