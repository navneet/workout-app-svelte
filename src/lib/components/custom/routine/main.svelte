<script>
    import ToggleButton from '$lib/components/custom/routine/toggleButton.svelte';
    let timeKeeper = null;
    let value = null;
    let disabled = false;
    let click = null;
    let active = false;
    export {timeKeeper, value, active, disabled, click};
</script>

<div>
    <slot></slot>
    <ToggleButton bind:active {timeKeeper} {value} {disabled} {click} />
</div>

<style lang=scss>
div {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
</style>