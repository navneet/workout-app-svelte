import { writable } from "svelte/store";
import { routineItemTypes, RoutineItem } from '$lib/stores/workout/types';

const Routine = () => {
    const { subscribe, set, update } = writable([]);

    const setWorkout = ($workout) => {
        set(create($workout.meta, $workout.exercises));
    }

    const create = ($workoutMeta, $workoutExercises) => {
    
        let routine = [];
    
        /**
        * Add flags to each exercise and create a new routineItem from it.
        * Insert a new 'REST' item after every exercise
        * Insert a new 'BREAK' item after every round
        */
        for (let i=0; i<$workoutMeta.tabatas; i++) {
            $workoutExercises.forEach((exercise, index) => {
                const routineItem = Object.assign({
                    cycle: index + 1,
                    round: i+1,
                    elapsed: 0,
                    duration: $workoutMeta.time_on,
                }, exercise);
                routineItem.type = routineItemTypes.WORK;
                routine.push(RoutineItem(routineItem));
                if (index < $workoutExercises.length-1) {
                    const routineItem = {
                        name: 'Rest',
                        display_name: 'Rest',
                        type: routineItemTypes.REST,
                        cycle: index + 1,
                        round: i + 1,
                        elapsed: 0,
                        duration: $workoutMeta.time_off,
                    };
                    routine.push(RoutineItem(routineItem));
                }
            })
            if (i < $workoutMeta.tabatas - 1) {
                const routineItem = {
                    name: 'Break',
                    display_name: 'Break',
                    type: routineItemTypes.BREAK,
                    cycle: 0,
                    round: i + 2,
                    elapsed: 0,
                    duration: $workoutMeta.rest_time,
                };
                routine.push(RoutineItem(routineItem));
            }
        }
    
        routine.unshift(RoutineItem({
            name: 'Prepare',
            display_name: 'Prep',
            type: routineItemTypes.PREP,
            cycle: 0,
            round: 0,
            elapsed: 0,
            duration: $workoutMeta.prep_time,
        }))
        return routine;
    }

    const hasStarted = () => {
        let has = false;
        const sub = subscribe($routine => {
            if ($routine.length) has = $routine[0].elapsed > 0;
        });
        sub();
        return has;
    }

    const isComplete = () => {
        let complete = false;
        update ($routine => {
            complete = Boolean($routine.length) && $routine.every(item => item.elapsed === item.duration);
            return $routine;
        })
        return complete;
    }

    const reset = () => {
        update($routine => {
            return $routine.map(item => {
                item.elapsed = 0;
                return item;
            });
        })
    }

    return {
        subscribe, set, update, setWorkout, reset, isComplete, hasStarted
    }
}
export default Routine();