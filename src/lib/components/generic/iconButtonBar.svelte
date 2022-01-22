<script>
    import IconButton from '$lib/components/generic/iconButton.svelte';
    let vertical = false;
    let hide = false;
    let buttons = [];
    export {vertical, hide, buttons};
</script>

<div class:hide class:vertical>
    {#if buttons.length}
    {#each buttons as button }
        {#if 'component' in button}
        <svelte:component on:click on:dblclick on:mouseenter on:mouseleave this={button.component} {...button.props} />
        {:else}
        <IconButton 
            on:click on:dblclick on:mouseenter on:mouseleave
            {...button}/>
        {/if}
    {/each}
    {:else}
    <slot></slot>
    {/if}
</div>

<style lang=scss>
div {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    &.vertical {
        flex-flow: column nowrap;
    }
}
</style>