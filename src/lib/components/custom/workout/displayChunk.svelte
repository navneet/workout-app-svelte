<script>
    import ExerciseCard from '$lib/components/custom/workout/exerciseCard.svelte';
    import IconButtonBar from '$lib/components/generic/iconButtonBar.svelte';
    let title, items, buttons;
    let draggable = true;
    export {title, items, draggable, buttons};
</script>

<h5>{title}</h5>
<ol on:dragover|preventDefault on:drop>
    {#each items as item, i}
    <li on:dragstart class:grabbable={draggable} {draggable}>
        <ExerciseCard
            name={item.display_name}
            completed={false}
            region={item.region}
            target={item.target}
            band_pos={item.band_pos}
            band_pos_text={item.band_pos_text}>
            <IconButtonBar on:click on:dblclick on:mouseenter on:mouseleave buttons={typeof buttons === 'function' ? buttons(items, i) : buttons} />
        </ExerciseCard>
    </li>
    {/each}
</ol>


<style lang=scss>
    @import 'scss/mixins';
    h5 {
        font-weight: bolder;
        text-transform: uppercase;
    }
    
    ol {
        display: flex;
        flex-flow: column nowrap;
        row-gap: calc(var(--theme-font-size)*2);
        li {
            display: flex;
            @include card-background;
            &.grabbable {
                cursor: grab;
                &:active {cursor: grabbing}
            }
        }
    }
    </style>