<script>
    import {secsToClock} from '$lib/cjs/helpers';
    import workout from '$lib/stores/workout/workout';
    import bodyParts from '$lib/stores/workout/bodyParts';
    import {Preset} from '$lib/stores/workout/presets';
    import FormPanel from '$lib/components/generic/formPanel.svelte';

    const updateWorkout = (event, isRule) => {
        const value = event.currentTarget.type === 'checkbox' ? event.currentTarget.checked : parseInt(event.currentTarget.value);
        if (!isNaN(value)) {
            if (isRule) {
                preset.updateRule(event.currentTarget.name, value);
                const totalInput = event.currentTarget.form.querySelector('input[name=total_exercises]');
                totalInput.value = preset.getTotalExercises($preset);
            } else {
                $preset[event.currentTarget.name] = value;
            }
            const totalInput = event.currentTarget.form.querySelector('input[name=total_time]');
            totalInput.value = secsToClock(preset.getTotalTime($preset));
        }
    }

    const change = event => {
        const ct = event.currentTarget;
        const isTimeInput = Object.keys(metaList).includes(ct.name);
        const isOption = ['has_plank', 'with_equipment'].includes(ct.name);
        updateWorkout(event, !isTimeInput && !isOption);
    }
    
    const generate = event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget.form);
        $preset.tabatas = parseInt(data.get('tabatas'));
        $preset.prep_time = parseInt(data.get('prep_time'));
        $preset.time_on = parseInt(data.get('time_on'));
        $preset.time_off = parseInt(data.get('time_off'));
        $preset.rest_time = parseInt(data.get('rest_time'));
        for (let r in $preset.rules) {
            $preset.rules[r] = parseInt(data.get(r));
        }
        workout.preset = preset;
    }

    const close = event => {
        if (event.currentTarget.name === 'submit') generate(event);
        open = false;
    }

    const getFieldsets = () => {
        const fieldsets = [];
        let fieldset = {
            legend: 'Exercises',
            inputs:[]
        };
        $bodyParts.forEach(bodyPart => {
            const inputField = {
                label: bodyPart.title,
                type: 'number',
                value: $preset.rules[bodyPart.id],
                id: bodyPart.id,
                name: bodyPart.id,
            };
            fieldset.inputs.push(inputField);
        });

        fieldset.inputs.push({
            label: 'Total Exercises',
            type: 'text',
            value: preset.getTotalExercises($preset),
            id: 'total_exercises',
            name: 'total_exercises',
            readonly: true,
        });
        fieldsets.push(fieldset);

        fieldset = {legend:'Time:', inputs:[]};
        Object.entries(metaList).forEach(meta => {
            const inputField = {
                label: meta[1],
                type: 'number',
                value: $preset[meta[0]],
                id: meta[0],
                name: meta[0],
            };
            fieldset.inputs.push(inputField);
        });

        fieldset.inputs.push({
            label: 'Total Time',
            type: 'text',
            value: secsToClock(preset.getTotalTime($preset)),
            id: 'total_time',
            name: 'total_time',
            readonly: true,
        });
        fieldsets.push(fieldset);

        fieldset = {legend:'Options:', inputs:[]};
        fieldset.inputs.push({
            label: 'Planks?',
            type: 'slider',
            checked: $preset.has_plank,
            id: 'has_plank',
            name: 'has_plank',
        });
        fieldset.inputs.push({
            label: 'Use Bands?',
            type: 'slider',
            checked: $preset.with_equipment,
            id: 'with_equipment',
            name: 'with_equipment',
        });
        fieldsets.push(fieldset);

        fieldset = {inputs:[{
            label: 'Generate',
            bindValue: false,
            type: 'submit',
            value: 'Generate Workout',
            id: 'submit',
            name: 'submit',
        }]};
        fieldsets.push(fieldset);

        return fieldsets;
    }

    const metaList = {
        prep_time: 'Prep Time (seconds)',
        time_on: 'Active Time (seconds)',
        time_off: 'Rest Time (seconds)',
        rest_time: 'Break Time (seconds)',
        tabatas: 'Rounds',
    }

    const preset = Preset($workout.meta);
    const id = 'workoutSettingsForm';
    let open = true;
    export {open};
</script>

<FormPanel {id}
    on:change={change}
    on:click={close}
    title='Customize {$preset.title} Workout' fieldsets={getFieldsets()} />