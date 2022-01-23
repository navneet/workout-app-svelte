<script>
    import { onMount } from "svelte";

    const mousemove = event => {
        if (!mPosition) {
            mPosition = {x: event.screenX, y:event.screenY};
            tooltip.style.setProperty('transform', `translateX(${mPosition.x-tooltip.parentNode.offsetLeft}px)`);
            tooltip.style.setProperty('transition', `transform ${duration/10}ms`);
        }
    }

    onMount(()=>{
        setTimeout(()=>show = false, duration);
    });

    let body = null;
    let duration = 1500;
    let show;
    let tooltip;
    let mPosition;
    export {show, body, duration};
</script>

<svelte:body on:mousemove={mousemove}/>

<div bind:this={tooltip} class=tooltip class:show>
<slot>
    {@html body}
</slot>
</div>

<style lang=scss>
.tooltip {
    display: flex;
    position: absolute;
    opacity: 0;
    max-width: fit-content;
    text-transform: capitalize;
    font-size: calc(var(--theme-font-size)*0.685);
    color: #fff;
    background-color: #323232;
    padding: calc(var(--theme-font-size)*0.28);
    border-radius: calc(var(--theme-font-size)*0.1875);
    &.show {
        opacity: 1;
        transition: opacity .3s;
    }
}
</style>