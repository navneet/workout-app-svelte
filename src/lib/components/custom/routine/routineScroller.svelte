<script>
    import {onDestroy} from 'svelte';
    import routine from '$lib/stores/routine';
    import {routineItemTypes} from '$lib/stores/workout/types';
    import ScrollableViewport from '$lib/components/generic/scrollableViewport.svelte';
    import ExerciseCard from '$lib/components/custom/workout/exerciseCard.svelte';

    const getDisplayItems = ($routine) => {
        const items = [];
        $routine.forEach((currentItem, i) => {
            if (i%2 === 0) return;
            items.push([$routine[i-1], currentItem]);
        });
        return items;
    }

    let listNode, active;
    const rSub = routine.subscribe($routine => {
        if (!$routine.length || !active) return;
        const currentIndex = $routine.findIndex(
            item => item.elapsed < item.duration && item.type === routineItemTypes.WORK);
        if (currentIndex === -1) return;
        const index = Math.ceil(currentIndex/2) - 1;
        const child = listNode.children[index];
        listNode.scrollTo({
            top: child.offsetHeight * index,
            behavior:'smooth',
        });
    });

    onDestroy(()=>rSub());

    export {active};
</script>
<ScrollableViewport>
    <ol bind:this={listNode}>
        {#each getDisplayItems($routine) as items}
        <li>
            {#each items as item}
                {#if item.type !== routineItemTypes.WORK}
                <h2 class=rest-item>{item.display_name}</h2>
                {:else}
                <ExerciseCard
                    name={item.display_name}
                    completed={item.duration === item.elapsed}
                    region={item.region}
                    target={item.target}
                    band_pos={item.band_pos}
                    band_pos_text={item.band_pos_text}
                />
                {/if}
            {/each}
        </li>
        {/each}
    </ol>
</ScrollableViewport>

<style lang=scss>
/*Layout*/
ol {
    display: flex;
    flex-flow: column nowrap;
    max-height: var(--theme-scroll-viewport-height);
    overflow: scroll;
    li {
        flex: 0 0 var(--theme-scroll-viewport-height);
        display: flex;
        column-gap: var(--theme-gap-unit);
        padding: var(--theme-gap-unit);
    }
}

/** Hacks */
ol {
    li {
        //padding-bottom: var(--theme-font-size);
        border-bottom: calc(var(--theme-gap-unit) * .1) dotted rgba(100, 100, 100, 0.5);
    }
}

/** Decoration*/
.rest-item {text-align: center}

h2 {font-size: var(--theme-font-size)}
</style>