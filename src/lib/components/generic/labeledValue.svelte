<script>
    let label = '';
    let value;
    let vertical = true;
    export {label, value, vertical};
</script>

<div class:vertical>
    <h6>{label}</h6>
    {#if value}
        {#if Array.isArray(value)}
        {#each value as v}
            <h5>{v}</h5>
        {/each}
        {:else}
        <h5>{value}</h5>
        {/if}
    {:else}
    <slot></slot>
    {/if}
</div>

<style lang=scss>
@import 'scss/mixins';
div {
    display: flex;
    align-items: center;
    gap: calc(var(--theme-font-size) * 0.5);
    &.vertical {
        flex-flow: column nowrap;
        gap: calc(var(--theme-font-size) * 0.25);
    }

    h6 {
        font-size: calc(var(--theme-font-size) * 0.9);
        text-align: center;
        text-transform: uppercase;
        @include shadow-text;
    }

    h5 {
        font-size: calc(var(--theme-font-size) * 1.3);
        text-align: center;
        padding: calc(var(--theme-font-size) * 0.25) calc(var(--theme-font-size) * 0.65);
        @include light-shadow;
    }
}
</style>
