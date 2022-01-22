<script>
    let id = null;
    let name = null;
    let checked = false;
    let disabled = false;
    export {id, name, checked, disabled};
</script>

<div class:checked>
    <input on:change bind:checked={checked} type=checkbox {id} {name} {disabled}>
    <span on:click={()=>{checked = !checked}} class:checked></span>
</div>

<style lang=scss>
div {
    display: flex;
    align-items: center;
    min-width: calc(var(--theme-font-size)*2.3);
    max-height: calc(var(--theme-font-size)*0.95);
    border-radius: calc(var(--theme-font-size)*0.5);
    background-color: var(--theme-slider-off);
    transition: calc(var(--theme-animation-speed)*1.5);
    &.checked {background-color: var(--theme-slider-on)}
    input[type=checkbox] {display: none}

    /* The slider ball */
    span {   
        cursor: pointer;
        min-width: calc(var(--theme-font-size)*0.99);
        min-height: calc(var(--theme-font-size)*0.99);
        border-radius: calc(var(--theme-font-size)*0.95);
        background-color: var(--theme-slider);
        box-shadow: 0 0 1px var(--theme-text);
        transform: translateX(0);
        transition: transform calc(var(--theme-animation-speed)*0.8);
        &.checked{transform: translateX(130%)}
    }
}
</style>
