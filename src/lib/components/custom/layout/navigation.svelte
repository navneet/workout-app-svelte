<script>
    import {onDestroy} from 'svelte';
    import {page} from '$app/stores';
    import IconButton from '$lib/components/generic/iconButton.svelte';

    let open = false;
    let menuItems = [];
    const pgSub = page.subscribe($page => {
        if (!$page.url) return;
        menuItems = [
            {
                icon: 'bi bi-alarm',
                title: 'Tabata/Timer',
                href: '/routine',
            },
            {
                icon: 'bi bi-tools',
                title: 'Create New Workout',
                href: '/workout',
            },
            {
                icon: 'bi bi-music-note-beamed',
                title: 'Play Music',
                href: '/music',
            },
        ];
        menuItems = menuItems.map(item => {
            item.active = $page.url.pathname.match(item.href);
            return Object.preventExtensions(item);
        });
    });

    onDestroy(()=>pgSub());

    export {open};
</script>

<nav class:open>
    {#if open}
    <div class='menu'>
        {#each menuItems as item}
        <IconButton {...item} --theme-icon-size='1.4rem' />
        {/each}
    </div>
    {/if}
    <i on:click={() => open = !open} class=hamburger class:icon-cross={open}><span></span></i>
</nav>

<style lang=scss>
nav {
    flex: 0;
    display: flex;
    align-items: center;
    justify-content: end;
    
    &.open {
        flex: 1;
        transition: flex calc(var(--theme-animation-speed) * 2) ease-out;
    }

    div.menu {
        flex: 1;
        display: flex;
        justify-content: space-around;
    }

    i.hamburger {
        display: flex;
        align-items: center;
        position: relative;
        min-width: calc(var(--theme-icon-size) * 2);
        min-height: calc(var(--theme-icon-size) * 2);
        cursor: pointer;

        span { /* This is the line container of the humburger*/
            position: absolute;
            right: 0;
            width:  calc(var(--theme-icon-size) * 2);
            height: calc(var(--theme-icon-size) * 0.18);
            border-radius: calc(var(--theme-icon-size) * 0.6);
            background-color: var(--theme-text);

            &:before,
            &:after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: calc(var(--theme-icon-size) * 0.6);
                background-color: var(--theme-text);
            }

            &:before {
                transform: translateY(calc(var(--theme-icon-size) * -0.5));
                transition: transform calc(var(--theme-animation-speed) / 1.1) calc(var(--theme-animation-speed) / 3) ease;
            }

            &:after {
                transform: translateY(calc(var(--theme-icon-size) * 0.5));
                transition: transform calc(var(--theme-animation-speed) / 1.1) calc(var(--theme-animation-speed) / 3) ease;
            }
        }

        &:hover {
            span {
                width: calc(var(--theme-icon-size) * 2.1);
                &:before {width: var(--theme-icon-size)}
                &:after {width: calc(var(--theme-icon-size) * 1.5)}
            }
        }

        /* Icon Close */
        &.icon-cross {
            span {
                justify-content: center;
                width: initial;
                right: initial;
                opacity: 0.5;
                transition: all 0.6s ease;
                &:before,
                &:after {width: calc(var(--theme-icon-size) * 1.5)}
                &:before {transform: rotate(45deg)}
                &:after {transform: rotate(-45deg)}
            }

            &:hover {
                span {
                    width: initial;
                    opacity: 1;
                    &:before {transform: rotate(45deg)}
                    &:after {transform: rotate(-45deg)}
                }
            }
        }
    }
}
</style>