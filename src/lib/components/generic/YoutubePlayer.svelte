<script>
    import {onDestroy} from 'svelte';
    import {loadScript} from '$lib/cjs/helpers';
    import Preloader from '$lib/components/generic/preloader.svelte';

    const youtubeIframeAPIReady = () => {
        return new Promise(resolve => {
            if (typeof window !== 'undefined') {
                if (typeof window['YT'] !== 'undefined' && typeof window['YT'].Player === 'function') {
                    resolve();
                } else {
                    window['onYouTubeIframeAPIReady'] = () => resolve();
                    loadScript('https://www.youtube.com/iframe_api');
                }
            }
        });
    }

    const mountPlayer = parentNode => {
        youtubeIframeAPIReady().then(()=>{
            const initVars = {
                events:{
                    onReady: onReady,
                    onStateChange: onStateChange,
                    onError: onError,
                    onApiChange: onApiChange,
                    onPlaybackQualityChange: onPlaybackQualityChange,
                    onPlaybackRateChange: onPlaybackRateChange
                },
                playerVars: playerVars,
                videoId: videoId,
            };
            player = new window['YT'].Player(
                document.createElement('div'), initVars);
            while(parentNode.firstChild) parentNode.removeChild(parentNode.firstChild);
            parentNode.appendChild(player.getIframe());
        });
    }

    onDestroy(() => {
        if (player) player.destroy();
    });

    let player = null;
    let playerVars = {};
    let hide = false;
    let style = null;
    let videoId = null;
    let onReady = null;
    let onStateChange = null;
    let onPlaybackQualityChange = null;
    let onPlaybackRateChange = null;
    let onError = null;
    let onApiChange = null;

    export {
        player, playerVars, videoId, hide, style,
        onReady, onStateChange, onError, onApiChange,
        onPlaybackQualityChange, onPlaybackRateChange,
    };
</script>

<div use:mountPlayer class:hide {style}>
    <Preloader />
</div>

<style lang=scss>
div {
    display: flex;
    padding: calc(var(--theme-font-size)*.5);
    &.hide {display: none}
}
</style>