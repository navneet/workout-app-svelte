import {writable} from 'svelte/store';
import {secsToClock, secsToMinSecs} from '$lib/cjs/helpers';

const TimeKeeper = () => {
    const { subscribe, set, update } = writable(0);
    let interval = null;
    
    const start = () => {
        if (!isTicking()) {
            interval = setInterval(()=>{
                update(secs => secs + 1);
            }, 1000);
        }
    }

    const stop = () => {
        if (isTicking()) {
            clearInterval(interval);
            interval = null;
        }
    }

    const toggle = () => {
        isTicking() ? stop() : start();
    }

    const reset = () => {
        set(0);
    }

    const minSecs = (seconds) => {
        return secsToMinSecs(seconds);
    }

    const asClock = (seconds) => {
        return secsToClock(seconds);
    }

    const isTicking = () => {
        return interval !== null;
    }

    const mySet = (value=0) => {
        set(isNaN(value) ? 0 : value);
    }
    
    return {
		subscribe, start, stop, toggle, reset,
        set: mySet, minSecs, asClock, isTicking,
	};
}

export default TimeKeeper;