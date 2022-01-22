import { loadScript, getUserLangISO639 } from '$lib/cjs/helpers';

const _YTPlayer = () => {
    
    let player = {};
    let faderInterval = null;

    const playerVars = Object.preventExtensions({
        autoplay: 0,
        cc_lang_pref: null,
        cc_load_policy: 0,
        color: 'red',
        controls: 1,
        disablekb: 0,
        enablejsapi: 1,
        fs: 1,
        hl: null,
        iv_load_policy: 3,
        loop: 0,
        modestbranding: 1,
        origin: null,
        widget_referrer: null,
        playsinline: true,
    });

    const events = Object.preventExtensions({
        READY: 'onReady',
        STATE_CHANGE: 'onStateChange',
        PLAYBACK_QUALITY_CHANGE: 'onPlaybackQualityChange',
        PLAYBACK_RATE_CHANGE: 'onPlaybackRateChange',
        APICHANGE: 'onApiChange',
        ERROR: 'onError',
    });

    const isLoaded = () => {
        return typeof player.addEventListener === 'function';
    }

    function loadPlayer() {
        return new Promise(resolve => {
            if (isLoaded()) {
                resolve(player);
            } else {
                window['onYouTubeIframeAPIReady'] = () => {
                    playerVars.cc_lang_pref = getUserLangISO639();
                    playerVars.hl = navigator.language || navigator['userLanguage'];
                    playerVars.origin = window.location.origin;
                    playerVars.widget_referrer = window.location.href;
                    player = new window['YT'].Player(
                        document.createElement('div'),
                        { playerVars: playerVars });
                    resolve(player);
                };
                loadScript('https://www.youtube.com/iframe_api');
            }
        });
    }

    const mount = node => {
        if (typeof node === 'string')
            node = document.getElementById(node);
        if (node) {
            loadPlayer().then(player => {
                node.parentElement.replaceChild(player.getIframe(), node);
            });
        }
    }

    const fadeVolumeTo = (endVolume=0) => {
        return new Promise(resolve => {
            if (typeof player.addEventListener === 'function') {
                if (isNaN(endVolume)) endVolume = 0;
                if (player.getPlayerState() == window['YT'].PlayerState.PLAYING) {
                    let inc = 5;
                    const currentVolume = player.getVolume();
                    if (currentVolume == endVolume) resolve(currentVolume);
                    if (endVolume < currentVolume) inc *= -1;
                    if (!isNaN(faderInterval)) clearInterval(faderInterval);
                    faderInterval = setInterval(() => {
                        const currentVolume = player.getVolume();
                        const resolvable = (inc > 0 && currentVolume >= endVolume) || (inc < 0 && currentVolume <= endVolume);
                        if (resolvable) {
                            clearInterval(faderInterval);
                            faderInterval = null;
                            player.setVolume(endVolume);
                            resolve(currentVolume);
                        } else {
                            player.setVolume(currentVolume + inc);
                        }
                    }, 60);
                } else {
                    player.setVolume(endVolume);
                    resolve(endVolume);
                }
            } else {
                resolve(0);
            }
        });
    }

    const addEventListener = async (event, listener) => {
        if (!Object.values(events).includes(event))
            throw new TypeError(event + ' is not a valid player event');
        loadPlayer().then(player => {
            player.addEventListener(event, listener);
        });
    }

    const removeEventListener = (event, listener) => {
        if (typeof player.removeEventListener === 'function') {
            if (!Object.values(events).includes(event))
                throw new TypeError(event + ' is not a valid player event');
            player.removeEventListener(event, listener);
        }
    }

    const destroy = () => {
        if (isLoaded()) {
            player.destroy();
            player = {};
        }
    }

    return {
        loadPlayer, mount, isLoaded, destroy, addEventListener, removeEventListener, fadeVolumeTo,
        setSize: (width='100%', height='100%') => player.setSize(width, height),
        playVideo: () => player.playVideo(),
        pauseVideo: () => player.pauseVideo(), 
        stopVideo: () => player.stopVideo(),
        seekTo: (seconds=0, allowSeekAhead=true) => player.seekTo(seconds, allowSeekAhead),
        getPlayerState: () => player.getPlayerState(),
        getDuration: () => player.getDuration(),
        getVideoUrl: () => player.getVideoUrl(),
        getPlaylist: () => player.getPlaylist(),
        getPlaylistIndex: () => player.getPlaylistIndex(),
        getCurrentTime: () => player.getCurrentTime(),
        getVideoStartBytes: () => player.getVideoStartBytes(),
        getVideoBytesLoaded: () => player.getVideoBytesLoaded(),
        getVideoBytesTotal: () => player.getVideoBytesTotal(),
        nextVideo: () => player.nextVideo(),
        previousVideo: () => player.previousVideo(),
        playVideoAt: (index) => player.playVideoAt(index),
        mute: () => player.mute(),
        unmute: () => player.unmute(),
        isMuted: () => player.isMuted(),
        getVolume: () => player.getVolume(),
        setVolume: (value=100) => player.setVolume(value),
        getSphericalProperties: () => player.getSphericalProperties(),
        setSphericalProperties: (properties) => player.setSphericalProperties(properties),
        getPlaybackRate: () => player.getPlaybackRate(),
        setPlaybackRate: (suggestedRate=1) => player.setPlaybackRate(suggestedRate),
        getAvailablePlaybackRates: () => player.getAvailablePlaybackRates(),
        setLoop: (loopPlaylists=false) => player.setLoop(loopPlaylists),
        setShuffle: (shufflePlaylist=false) => player.setShuffle(shufflePlaylist),
        getVideoLoadedFraction: () => player.getVideoLoadedFraction(),
        getIframe: () => player.getIframe(),
        get playerVars() {return playerVars},
        set playerVars(vars) {
            if (isLoaded()) {
                console.error('PlayerVars cannot be set after the player has loaded');
            } else {
                Object.entries(vars).forEach(([k, v]) => playerVars[k] = v);
            }
        },
        READY: events.READY,
        STATE_CHANGE: events.STATE_CHANGE,
        PLAYBACK_QUALITY_CHANGE: events.PLAYBACK_QUALITY_CHANGE,
        PLAYBACK_RATE_CHANGE: events.PLAYBACK_RATE_CHANGE,
        APICHANGE: events.APICHANGE,
        ERROR: events.ERROR,
    }
}

const YTPlayer = _YTPlayer();
export default YTPlayer;