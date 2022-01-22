import { writable, derived } from "svelte/store";
import { titleCase } from '$lib/cjs/helpers';
import WorkoutDb from "$lib/stores/workout/db";
import bodyParts from '$lib/stores/workout/bodyParts';

const Preset = (inputObj=null) => {
    
    const template = Object.preventExtensions({
        id:null,
        title:null,
        tabatas:3,
        prep_time:10,
        time_on:40,
        time_off:15,
        rest_time:60,
        with_equipment:true,
        has_plank:true,
        pathname:null,
        rules:{}
    });
    const {subscribe, set, update} = writable(template);

    const mySet = (value) => {
        value = Object.assign(template, value);
        const bpsub = bodyParts.subscribe($bodyParts => {
            if ($bodyParts.length) {
                const allSelects = Object.fromEntries($bodyParts.
                    map($exty => [$exty.id, 0]));
                value.rules = Object.preventExtensions(
                    Object.assign(allSelects, value.rules));
            }
            return true;
        })
        bpsub();
        set(value);
    }

    const updateRule = (key, value) => {
        let updated = false;
        update($preset => {
            if (value && !isNaN(value))
                $preset.rules[key] = value;
                updated = true;
            return $preset;
        })
        return updated;
    }

    const getTotalExercises = ($preset=null) => {
        if (!$preset) {
            const psub = subscribe($p => $preset = $p);
            psub();
        }
        return Object.entries($preset.rules).
            reduce((p, c) => p + (isNaN(c[1]) ? 0 : c[1]), 0);
    }

    const getTotalTime = ($preset=null) => {
        if (!$preset) {
            const psub = subscribe($p => $preset = $p);
            psub();
        }
        const totalExercises = getTotalExercises($preset);
        let total = 0;
        total += $preset['prep_time'];
        total += $preset['time_on'] * totalExercises * $preset['tabatas'];
        total += $preset['time_off'] * (totalExercises - 1) * $preset['tabatas'];
        total += $preset['rest_time'] * ($preset['tabatas'] - 1);
        return total;
    }

    const get = (key=null) => {
        let $preset;
        const psub = subscribe($p => $preset = $p);
        psub();
        return key ? $preset[key] : $preset;
    }

    const clone = ($preset=null) => {
        if (!$preset) {
            const psub = subscribe($p => $preset = $p);
            psub();
        }
        const clone = Object.fromEntries(Object.entries($preset));
        clone['rules'] = Object.fromEntries(Object.entries($preset.rules));
        return clone;
    }

    if (inputObj) mySet(inputObj);

    return {
        subscribe, set: mySet, get, clone,
        update, updateRule, getTotalTime, getTotalExercises,
    }
}

const presets = derived(WorkoutDb, ($WorkoutDb, set)  => {
    if (!$WorkoutDb) return [];
    const rules = $WorkoutDb.querySelector('selection_rules');
    if (!rules) return [];

    const $presets = [];
    Array.from(rules.children).forEach(rule => {
        const meta = {
            id: rule.tagName,
            title: titleCase(rule.tagName.replace('_', ' ')),
            tabatas: parseInt(rule.getAttribute('tabatas')),
            rest_time: parseInt(rule.getAttribute('rest_time')),
            time_on: parseInt(rule.getAttribute('time_on')),
            time_off: parseInt(rule.getAttribute('time_off')),
            prep_time: parseInt(rule.getAttribute('prep_time')) || 10,
        }
        const selects = Array.from(rule.children).
            map(r => [r.tagName, parseInt(r.getAttribute('select'))]);
        meta.rules = Object.fromEntries(selects);

        $presets.push(Preset(meta));
    });
    set($presets);
}, []);

export {Preset, presets};