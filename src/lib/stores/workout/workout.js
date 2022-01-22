import { writable, derived, get } from "svelte/store";
import { pickRandomFromArray, getRandomString } from "$lib/cjs/helpers";
import API from "$lib/cjs/api";
import WorkoutDb from "$lib/stores/workout/db";
import { LocalStore } from "$lib/stores/storage";
import {Preset} from '$lib/stores/workout/presets';
import { EXERCISE_TYPE, ExerciseObject } from "$lib/stores/workout/types";

const Workout = (preset=Preset()) => {
    
    const template = Object.preventExtensions({
        meta: preset ? preset.get() : null,
        [EXERCISE_TYPE.EXERCISE]:[],
        [EXERCISE_TYPE.PLANK]:[],
    });
    const {subscribe, set, update} = writable(template);

    const setPreset = (value=Preset()) => {
        preset = value;
        const wrkSub = WorkoutDb.subscribe($WorkoutDb => {
            if (!$WorkoutDb) return;
            const gWorkout = {};
            gWorkout.meta = cloneMeta(preset.get());
            gWorkout[EXERCISE_TYPE.EXERCISE] = [];
            gWorkout[EXERCISE_TYPE.PLANK] = [];

            for(let rule in gWorkout.meta.rules) {
                if (!parseInt(gWorkout.meta.rules[rule])) continue;
                const ruleExercises = $WorkoutDb.querySelector('exercises > ' + rule).children;
                gWorkout[EXERCISE_TYPE.EXERCISE] = gWorkout[EXERCISE_TYPE.EXERCISE].concat(
                    _randomPicker(ruleExercises, gWorkout.meta.rules[rule], false, gWorkout.meta.with_equipment));
            }
    
            if (gWorkout.meta.with_equipment) {
                const ascOrDsc = Math.random() > 0.5 ? 1 : -1;
                gWorkout[EXERCISE_TYPE.EXERCISE] = gWorkout[EXERCISE_TYPE.EXERCISE].sort((a, b) => (a.band_pos - b.band_pos) * ascOrDsc);
            }
    
            if (gWorkout.meta.has_plank) {
                const planks = $WorkoutDb.querySelector('planks');
                gWorkout[EXERCISE_TYPE.PLANK] = _randomPicker(
                    planks.children,
                    parseInt(planks.getAttribute('select')),
                    true, gWorkout.meta.with_equipment);
            }

            set(gWorkout);
        });
        wrkSub();
    }

    const save = (toServer=false) => {
        update($gw => {
            if (!$gw.meta.pathname)
                $gw.meta.pathname = getRandomString(10);
            LocalStore.setItem('workout', $gw);
            if (toServer === true) API.saveWorkout($gw);
            return $gw;
        });
    }

    const getTotalTime = ($workout=null) => {
        if (!$workout) {
            const wrkSub = subscribe($w => $workout = $w);
            wrkSub();
        }
        
        const totalExercises = $workout[EXERCISE_TYPE.EXERCISE].length;
        let total = 0;
        total += $workout.meta.prep_time;
        total += $workout.meta.time_on * totalExercises * $workout.meta.tabatas;
        total += $workout.meta.time_off * (totalExercises - 1) * $workout.meta.tabatas;
        total += $workout.meta.rest_time * ($workout.meta.tabatas - 1);
        return total;
    }

    const cloneMeta = ($meta=null) => {
        if (!$meta) {
            const mSub = subscribe($w => $meta = $w.meta)();
            mSub();
        }
        const clone = Object.fromEntries(Object.entries($meta));
        clone['rules'] = Object.fromEntries(Object.entries($meta.rules));
        return clone;
    }

    const alterExercise = (index = -1, type=EXERCISE_TYPE.EXERCISE, action='replace') => {
        update($generatedWorkout => {
            const item = $generatedWorkout[type][index];

            switch (action) {
                case 'delete':
                    _spliceExerciseAt(index, $generatedWorkout[type]);
                    if (type !== EXERCISE_TYPE.PLANK) {
                        $generatedWorkout.meta.rules[item.region] -= 1;
                    }
                    break;
            
                case 'replace':
                    const replacements = _randomReplacer(index, $generatedWorkout[type], type);
                    if (replacements.length)
                        _spliceExerciseAt(index, $generatedWorkout[type], replacements);
                    break;
            }
            return $generatedWorkout;
        });
    }

    const swapExercise = (index = -1, replaceIndex = -1, type=EXERCISE_TYPE.EXERCISE) => {
        if (index < 0) return;

        update($generatedWorkout => {
            const excLen = $generatedWorkout[type].length;
            if (replaceIndex == -1) {
                replaceIndex = excLen - 1;
            } else if (replaceIndex == excLen) {
                replaceIndex = 0;
            }

            // Swap
            const removedItems = $generatedWorkout[type].splice(
                replaceIndex, 1, $generatedWorkout[type][index]);
            
            //Put the removed items back in
            $generatedWorkout[type].splice(index, 1, ...removedItems);

            return $generatedWorkout;
        });
    }

    const _randomReplacer = (index, exercises, type) => {
        const item = exercises[index];
        if (!item) return [];
        
        const excludeList = exercises.
        filter(ex => ex.region === item.region).
        map(ex => ex.name);

        const $WorkoutDb = get(WorkoutDb);
        let nodePath = type;
        if (type == EXERCISE_TYPE.EXERCISE) nodePath += ' > ' + item.region;

        let exDb = $WorkoutDb.querySelector(nodePath);
        const filtered = Array.from(exDb.children).
        filter(node => !excludeList.includes(node.getAttribute('name')));
        return _randomPicker(filtered, 1, type==EXERCISE_TYPE.PLANK);
    }

    const _randomPicker = (picks, num, isPlank, withEquipment=true) => {

        picks = picks instanceof Array ? picks : Array.from(picks);
    
        if (withEquipment === false)
            picks = picks.filter(pick => parseInt(pick.getAttribute('band_pos')) == 0);
        
        if (picks.length > num)
            picks = pickRandomFromArray(picks, num);
        
        let $bandPosTexts;
        const bpSub = bandPosTexts.subscribe($v => $bandPosTexts = $v);
        bpSub();
        let exercises = [];
        for (let i in picks) {
            const hasLR = Boolean(parseInt(picks[i].getAttribute('has_lr')));
            const exName = picks[i].getAttribute('name');
            const exercise = ExerciseObject();
            exercise.type =  isPlank ? EXERCISE_TYPE.PLANK : EXERCISE_TYPE.EXERCISE;
            exercise.name = exName;
            exercise.display_name = exName + (hasLR ? ' (Right)' : '');
            exercise.region = picks[i].parentElement.tagName;
            exercise.target = picks[i].getAttribute('target');
            exercise.has_lr = hasLR;
            exercise.band_pos = parseInt(picks[i].getAttribute('band_pos'));
            exercise.band_pos_text = $bandPosTexts[picks[i].getAttribute('band_pos')];
    
            if (hasLR) {
                const leftExercise = Object.assign(ExerciseObject(), exercise);
                leftExercise.display_name = exName + ' (Left)';
                exercises.push(leftExercise);
            }
    
            exercises.push(exercise);
        }
        return exercises;
    }

    const _spliceExerciseAt = (index=-1, exercises=[], replacements=[]) => {
        const item = exercises[index];
        const pairItemIndex = item.has_lr === true ? exercises.findIndex(
            ex => ex.name == item.name && ex !== item) : -1;
        if (pairItemIndex > -1) {
            exercises.splice(pairItemIndex, 1);
            index = exercises.indexOf(item);
        }
        replacements.length ? exercises.splice(index, 1, ...replacements) : exercises.splice(index, 1);
    }

    const bandPosTexts = derived(WorkoutDb, $WorkoutDb  => {
        if (!$WorkoutDb) return {};
        const out = {};
        const legends = $WorkoutDb.querySelector('band_legends');
        Array.from(legends.children).forEach(legend => {
            out[legend.getAttribute('id')] = legend.getAttribute('title');
        });
        return out;
    }, {});

    return {
        subscribe, set, update, save, cloneMeta,
        alterExercise, swapExercise, getTotalTime,
        get preset() {return preset},
        set preset(value) {setPreset(value)},
    }
}

export default Workout();