import {writable} from "svelte/store";
import { LocalStore } from '$lib/stores/storage';

const _AppStore = () => {

    const routine = writable(Object.preventExtensions({
        tabataLink: '/routine/tabata',
        timerLink: '/routine/timer',
        currentLink: '/routine/tabata',
        stopTime: 0,
    }));

    const music = writable(Object.preventExtensions({
        showPlayer: false,
        player: undefined,
        icons: {play:'bi bi-play-circle', pause:'bi bi-pause-circle'},
        playlist: {
            list: 'PLHUFhflY14R-dbmlHvpF0-RoX7MUCzJMK',
            listType: 'playlist',
        }
    }));

    const userSettings = UserSettings();
    const docBodyBgColor = writable(null);

    const getStores = () => {
        return {
            routine, music, userSettings, docBodyBgColor,
        };
    }

    return getStores();
}

const UserSettings = () => {
    const storage_key = 'user_settings';
    const { subscribe, set } = writable({}, set => {
        set(LocalStore.getItem(storage_key));
    });
    const mySet = (value) => {
        LocalStore.setItem(storage_key, value);
        set(value);
    }
    return {subscribe, set: mySet};
}

const AppStore = _AppStore();
export default AppStore;