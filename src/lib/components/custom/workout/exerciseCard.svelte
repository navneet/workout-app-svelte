<script>
    import {titleCase} from '$lib/cjs/helpers';
    export let name, completed, region, target, band_pos, band_pos_text;
</script>

<div>
    <span>
        <h6>Exercise:</h6>
        <h4>
            {name}
            {#if completed}
            <i class="bi bi-check"></i>
            {/if}
        </h4>
    </span>
    <span><h6>Region:</h6><h6>{titleCase(region.replace('_', ' '))}&nbsp;({target})</h6></span>
    {#if band_pos !== 0}
    <span><h6>Band:</h6><h6>{band_pos_text}</h6></span>
    {/if}
    <slot></slot>
</div>

<style lang=scss>

div {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    row-gap: calc(var(--theme-font-size) * .5);
    :nth-child(n) {
        display: flex;
        flex-flow: row nowrap;
        //column-gap: var(--theme-gap-unit);
        :first-child {
            flex: 0 0 22%;
        }
    }
}
span {
    :first-child {
        text-transform: uppercase;
        font-size: var(--theme-font-size);
    }
}

h4, h6 {
    display: flex;
}

h4 {
    flex: 1;
    font-size: var(--theme-font-size);
}

h6 {
    font-size: calc(var(--theme-font-size) * .95);
}
</style>