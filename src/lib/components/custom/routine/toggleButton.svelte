<script>
    import {onDestroy} from 'svelte';
    import Voice from '$lib/cjs/Voice';
    import AppStore from '$lib/stores/appStore';
    import IconButton from "$lib/components/generic/iconButton.svelte";

    const userSettings = AppStore.userSettings;
    let timeKeeper = null;
    let active = false;
    let value = null;
    let disabled = false;
    let hide = false;
    let click = null;

    const onClick = event => {
        active = !active;
        if (timeKeeper)
            active ? timeKeeper.start() : timeKeeper.stop();
        //Required only for the first time to activate voice
        Voice.activateOnClick($userSettings.preferred_voice);
        if (!active) Voice.clearPending();
    
        //If there's a callback, call it.
        if (click && typeof click === 'function') click(event);
    }

    onDestroy(() => {if (timeKeeper && timeKeeper.isTicking()) timeKeeper.stop()});
    
    export {timeKeeper, value, active, disabled, hide, click};
</script>


<IconButton {active} {disabled} {hide} on:click={onClick}>
    <div class=value-display>
        {#if value}
        <h2>{typeof value === 'function' ? value($timeKeeper) : value}</h2>
        {:else}
        <i class='bi bi-power' title=Start!></i>
        {/if}
    </div>
</IconButton>


<style lang=scss>
div.value-display {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: calc(var(--theme-icon-size) * 7.5);
    min-height: calc(var(--theme-icon-size) * 7.5);
    h2 {
        font-size: calc(var(--theme-icon-size) * 1.75);
        white-space: nowrap;
    }

    i.bi {
        font-size: calc(var(--theme-icon-size) * 6.5);
    }
}
</style>