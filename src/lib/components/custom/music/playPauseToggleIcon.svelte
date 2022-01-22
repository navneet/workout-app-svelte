<script>
    import AppStore from '$lib/stores/appStore';
    import IconButton from '$lib/components/generic/iconButton.svelte';
    const click = () => {
        active = !active;
        active ? $musicState.player.playVideo() : $musicState.player.pauseVideo();
    }

    const musicState = AppStore.music;
    let active = typeof $musicState.player !== 'undefined' && $musicState.player.getPlayerState() === 1;
    $: icon = active ? $musicState.icons.pause : $musicState.icons.play;
</script>

{#if typeof $musicState.player !== 'undefined'}
<IconButton on:click={click} {...$$restProps} {active} {icon}/>
{/if}