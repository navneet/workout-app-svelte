<script>
    import { onMount } from 'svelte';
    import {page} from '$app/stores';
    import AppStore from '$lib/stores/appStore';
    import ViewTitle from '$lib/components/generic/ViewTitle.svelte';
    const routineState = AppStore.routine;
    const docBodyBgColor = AppStore.docBodyBgColor;
    const click = event => $routineState.currentLink = event.currentTarget.href;
    onMount(()=>{
        const bgSub = docBodyBgColor.subscribe($bgClass => {
            if ($bgClass) {
                if (!document.body.classList.contains($bgClass)) {
                    document.body.className = '';
                    document.body.classList.add($bgClass);
                }
            } else if (document.body.classList.length) {
                document.body.className = '';
            }
        });
        return () => {
            docBodyBgColor.set(null);
            bgSub();
        }
    });
</script>

<div class=component-title>
    <div class=titles>
        <a on:click={click} class:active={$page.url.pathname === $routineState.tabataLink} title=Tabata href={$routineState.tabataLink}>
            <ViewTitle title=Tabata />
        </a>
        <span>/</span>
        <a on:click={click} class:active={$page.url.pathname === $routineState.timerLink} title=Timer  href={$routineState.timerLink}>
            <ViewTitle title=Timer />
        </a>
    </div>
    <div class=line-container>
        <hr class:forward={$page.url.pathname === $routineState.timerLink}>
    </div>
</div>
<slot></slot>

<style lang=scss>
.component-title {
    display: flex;
    flex-flow: column nowrap;
    .titles {
        display: flex;
        justify-content: center;
        column-gap: calc(var(--theme-font-size)*.5);
        >a {
            opacity: 0.6;
            &.active {opacity: 1}
        }

        >span {
            font-size: calc(var(--theme-font-size) * 1.8);
            font-weight: bold;
        }
    }

    .line-container {
        width: 50%;
        align-self: flex-start;
        hr{
            border: 0;
            padding: 0;
            min-height: calc(var(--theme-icon-size) * 0.15);
            margin: 0 auto;
            background-color: var(--theme-text);
            transform: translateX(0);
            transition: transform calc(var(--theme-animation-speed)/4) ease-in;
            &.forward {transform: translateX(100%)}
        }
    }
}
</style>