<script>
    import {onDestroy} from 'svelte';
    import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    import Voice from '$lib/cjs/Voice';
    import AppStore from '$lib/stores/appStore';
    import YoutubePlayer from '$lib/components/generic/YoutubePlayer.svelte';

    const musicState = AppStore.music;
    const musicFader = tweened(100, {
		duration: 2000,
		easing: cubicOut,
	});

    const getPlayerVars = () => {
        return Object.preventExtensions({
            autoplay: 0,
            cc_load_policy: 0,
            color: 'red',
            controls: 1,
            disablekb: 0,
            enablejsapi: 1,
            fs: 1,
            iv_load_policy: 3,
            loop: 0,
            modestbranding: 1,
            playsinline: true,
        });
    }

    const onReady = event => {
        $musicState.player = event.target;
        event.target.setVolume(100);
        event.target.cuePlaylist($musicState.playlist);
        Voice.utterance.onstart = onUtterance;
        Voice.utterance.onend = onUtterance;
    }

    const onUtterance = event => {
        switch (event.type) {
            case 'start':
                $musicFader = 1;
                break;
            case 'end':
                $musicFader = 100;
                break;
        }
    }

    const fSub = musicFader.subscribe($value => {
        const player = $musicState.player;
        if (!player) return;
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) return;
        player.setVolume($value);
    });

    onDestroy(() => {
        fSub();
        $musicState.player = undefined;
    });

</script>


<YoutubePlayer
    playerVars={getPlayerVars()}
    hide={!$musicState.showPlayer} {onReady} />