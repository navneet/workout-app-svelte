<script>
    import {browser} from '$app/env';
    import Preloader from '$lib/components/generic/preloader.svelte';
    import Logo from '$lib/components/custom/layout/logo.svelte';
    import Navigation from '$lib/components/custom/layout/navigation.svelte';
    import MusicPlayer from '$lib/components/custom/music/musicPlayer.svelte';
    let open;
</script>

{#if browser}
<header>
    <div class=spacer class:shrink={open}>
        <Logo shrink={open} />
    </div>
    <Navigation bind:open />
</header>
<main>
    <slot></slot>
    <MusicPlayer />
</main>
<footer>
    <p>&#169; <a href="mailto:navneet@kalabaaz.com">Kalabaaz</a> ({(new Date()).getFullYear()})</p>
</footer>
{:else}
<main class=preloader>
    <Preloader />
</main>
{/if}

<style lang=scss>
@import 'scss/mixins';
header {
    display: flex;
    margin-bottom: calc(var(--theme-font-size)*.9);
    @include light-shadow;
    .spacer {
        flex: 1;
        transition: flex var(--theme-animation-speed) ease;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        &.shrink {flex: 0}
    }
}

main {
    display: flex;
    flex-flow: column nowrap;
    row-gap: calc(var(--theme-font-size) * 1.2);
    margin: auto;
    /*margin: auto 2%;
    @include tablet-screens {
        margin: auto 10%;
    }
    
    @include large-screens {
        margin: auto 20%;
    }*/

    &.preloader {
        margin: 15% auto;
        align-items: center;
        justify-content: center;
    }
}

footer {
    display: flex;
    margin: auto;
    justify-content: center;
    padding: calc(var(--theme-font-size) * 0.25);
    font-size: calc(var(--theme-font-size) * 0.9);
    text-transform: uppercase;
    border-top: calc(var(--theme-font-size) * 0.1) solid var(--theme-text);
    padding-bottom: calc(var(--theme-font-size) * 2);
    a {
        text-decoration: underline;
    }
}
</style>