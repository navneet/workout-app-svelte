import { derived } from "svelte/store";
import { titleCase } from '$lib/cjs/helpers';
import WorkoutDb from "$lib/stores/workout/db";

const bodyParts = derived(WorkoutDb, $WorkoutDb  => {
    if (!$WorkoutDb) return [];
    const exerciseList = $WorkoutDb.querySelector('exercises');
    return Array.from(exerciseList.children).map(exercise => {
        return Object.seal({
            id: exercise.tagName,
            title: titleCase(exercise.tagName.replace('_', ' '))
        });
    });
}, []);

export default bodyParts;