import { writable } from 'svelte/store';

const _storage = (engine='sessionStorage') => {

    const {subscribe, set, update} = writable('');
    
    let allowed;
    const setAllowed = value => allowed = value;

    const getEngine = () => {
        return _ready() ? engine : null;
    }

    const setEngine = (value) => {
        engine = value;
        _ready();
    }

    const setItem = (key, value) => {
        if (!_secure(key)) return;
        value = JSON.stringify(value);
        engine.setItem(key, value);
        set(key);
    }

    const getItem = (key) => {
        if (!_secure(key)) return;
        const item = engine.getItem(key);
        if (item === null && allowed[key] !== null) {
            set(allowed[key]);
            return allowed[key];
        } else if (item !== null) {
            set(key);
        }
        return JSON.parse(item);
    }

    const removeItem = (key) => {
        if (!_secure(key)) return;
        engine.removeItem(key);
        update($k => {
            if (key == $k) $k = '';
            return $k;
        })
    }

    const clear = () => {
        if (!_ready()) return;
        engine.clear();
        set('');
    }

    const _secure = (key) => {
        if (!_ready()) return false;
        if (!Object.keys(allowed).includes(key)) {
            throw new Error('Illegal Key: ' + key);
        }
        return true;
    }

    const _ready = () => {
        if (!engine) return false;
        if (typeof engine === 'string') {
            const possible = ['sessionStorage', 'localStorage'];
            if (!possible.includes(engine)) return false;
            try {
                engine = window[engine];
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        } else if (typeof engine.getItem === 'function') {
            return true;
        }
        return false;
    }
    
    return {
        subscribe, getEngine, setEngine, setItem, getItem,
        removeItem, clear,
        length: {get length() {return engine.length}},
        get allowed() {return allowed},
        set allowed(value) {setAllowed(value)},
    }
}

const SessionStore = _storage('sessionStorage');
SessionStore.allowed = Object.preventExtensions({
    routine: {},
});

const LocalStore = _storage('localStorage');
LocalStore.allowed = Object.preventExtensions({
    user_settings: {
        prep_time: 5,
        announce_every: 30,
        use_voice: true,
        show_plank: true,
        preferred_voice: null,
    },
    workout:{
        meta: {},
        exercises: [],
        planks: [],
    },
});

export {SessionStore, LocalStore};