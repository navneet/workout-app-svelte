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
    margin: calc(var(--theme-font-size)*1.25) 2%;
    @include tablet-screens {
        margin: calc(var(--theme-font-size)*1.25) 10%;
    }
    
    @include large-screens {
        margin: calc(var(--theme-font-size)*1.25) 25%;
    }

    &.preloader {
        align-items: center;
        justify-content: center;
    }
}

footer {
    display: flex;
    margin: calc(var(--theme-font-size)*1.25) 0;
    justify-content: center;
    align-items: center;
    font-size: calc(var(--theme-font-size) * 0.9);
    text-transform: uppercase;
    border-top: calc(var(--theme-font-size) * 0.1) dashed rgba($color: #000000, $alpha: 0.25);
    padding: calc(var(--theme-font-size) * 0.5);
    a {
        text-decoration: underline;
    }

    @include tablet-screens {
        margin: calc(var(--theme-font-size)*1.25) 10%;
    }
    
    @include large-screens {
        margin: calc(var(--theme-font-size)*1.25) 25%;
    }
}
</style>