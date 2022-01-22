<script>
import workout from '$lib/stores/workout/workout';
import {EXERCISE_TYPE} from '$lib/stores/workout/types';
import DisplayChunk from './displayChunk.svelte';

let gweLen = $workout[EXERCISE_TYPE.EXERCISE].length;
let gwpLen = $workout[EXERCISE_TYPE.PLANK].length;
let dragged = null;

const onDragStart = ev => {
    dragged = ev.currentTarget;
    ev.dataTransfer.effectAllowed = 'move';
}

const onDrop = ev => {
    ev.preventDefault();
    const droppedWithin = ev.path.indexOf(dragged.parentNode);
    if (droppedWithin < 1) return; //Not dropped on dragContainer
    const droppedOn = ev.path[droppedWithin - 1];
    if (dragged === droppedOn) return; //Dropped on same element

    /**Swap - DISABLBED BECAUSE A BETTER SVELTE WAY EXISTS
     * We have to update the data, so the update will trigger
     * a redraw, which means we don't have to call this code
     * line of dragContainer.insertBefore anymore.
    */
    //dragged.parentNode.insertBefore(dragged, droppedOn);

    //Swap the data.. 
    const children = Array.from(dragged.parentNode.children);
    workout.swapExercise(children.indexOf(dragged), children.indexOf(droppedOn), EXERCISE_TYPE.EXERCISE);
}

const onClick = ev => {
    const ds = ev.currentTarget.dataset;
    const id = parseInt(ds.id);
    switch (ds.action) {
        case 'up':
        case 'down':
            workout.swapExercise(id, id + (ds.action == 'down' ? 1 : -1), ds.type);
            break;
        
        case 'delete':
        case 'replace':
            workout.alterExercise(id, ds.type, ds.action);
            break;
    }
}

const getButtons = (exercise, index) => {
    const movementAllowed = exercise.type === EXERCISE_TYPE.PLANK ? gwpLen > 1 : gweLen > 1;
    const deleteAllowed = exercise.type === EXERCISE_TYPE.PLANK ? false : gweLen > 1;
    const data = {'data-id':index, 'data-type': exercise.type};
    return [
        {
            icon:'bi bi-arrow-repeat',
            title:'Replace Exercise',
            disabled: false,
            data: Object.assign({'data-action':'replace'}, data)
        },
        
        {
            icon:'bi bi-arrow-up-circle',
            title:'Move Up',
            disabled: !movementAllowed,
            data: Object.assign({'data-action':'up'}, data)
        },

        {
            icon:'bi bi-arrow-down-circle',
            title:'Move Down',
            disabled: !movementAllowed,
            data: Object.assign({'data-action':'down'}, data)
        },

        {
            icon:'bi bi-trash',
            title:'Trash',
            disabled: !deleteAllowed,
            data: Object.assign({'data-action':'delete'}, data),
        },
    ];
}
</script>


<DisplayChunk on:dragstart={onDragStart} on:drop={onDrop} on:click={onClick}
    title=Exercises
    items={$workout[EXERCISE_TYPE.EXERCISE]}
    draggable={gweLen > 1}
    buttons={getButtons}
/>

{#if $workout[EXERCISE_TYPE.PLANK].length > 0 && $workout.meta.has_plank === true}
<DisplayChunk on:dragstart={onDragStart} on:drop={onDrop} on:click={onClick}
    title=Planks
    items={$workout[EXERCISE_TYPE.PLANK]}
    draggable={gwpLen > 1}
    buttons={getButtons}
/>
{/if}