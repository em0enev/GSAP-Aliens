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
        this.on(Saucer.events.BEAM_HIDE, async () => await this._moveOut(tl))
    }

    async toggleBeam() {
        const tl = gsap.timeline();
        this.cow.on(Cow.events.ABDUCT_COMPLETE, async () => await this._toggleBeamOff(tl))
        this._toggleBeamOn(tl)
    }

    async _moveIn(tl) {
        await tl.to(this._saucerElement, { id: 'flyIn', x: '-835px', duration: 2 })
        await tl.pause();
        this.emit(Saucer.events.FLY_IN)
    }

    async _moveOut(tl) {
        tl.resume();
        await tl.to(this._saucerElement, {id: 'flyOut', x: '-1800px', duration: 2 })
        this.emit(Saucer.events.FLY_AWAY)
    }

    async _toggleBeamOn(tl) {
        const showTopBeam = gsap.fromTo(this._beamTopElement, { id: 'showTopBeam', x: '-835px', opacity: 0, duration: 0 }, { opacity: 0.6, duration: 3 });
        const showBottomBeam = gsap.fromTo(this._beamBottomElement, { id: 'showBottomBeam', x: '-835px', opacity: 0, duration: 0 }, { opacity: 0.6, duration: 3 })

        tl.add(showTopBeam);
        tl.add(showBottomBeam, '<')

        this.emit(Saucer.events.BEAM_SHOW)
    }

    async _toggleBeamOff(tl) {
        tl._first.vars.startAt.id = 'hideTopBeam';
        tl._last.vars.startAt.id = 'hideBottomBeam'
        await tl.reverse();

        this.emit(Saucer.events.BEAM_HIDE)
    }
}