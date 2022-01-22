<script>
    import AppStore from '$lib/stores/appStore';
    import Voice from '$lib/cjs/Voice';
    import routine from '$lib/stores/routine';
    import {routineItemTypes} from "$lib/stores/workout/types";
    import FormPanel from '$lib/components/generic/formPanel.svelte';

    const userSettings = AppStore.userSettings;

    const fieldsets = () => {
        const prepItem = $routine.find(item => item.type === routineItemTypes.PREP);
        const workItem = $routine.find(item => item.type === routineItemTypes.WORK);
        const restItem = $routine.find(item => item.type === routineItemTypes.REST);
        const breakItem = $routine.find(item => item.type === routineItemTypes.BREAK);
        const fieldset = {legend:'Runtime', inputs:[
            {
                id: 'prep_time',
                name: 'PREP',
                value: prepItem ?  prepItem.duration : 0,
                label: 'Prep Time (seconds)',
                type: 'number',
            },
            {
                id: 'time_on',
                name: 'WORK',
                value: workItem ?  workItem.duration : 0,
                label: 'Exercise Time (seconds)',
                type: 'number',
            },
            {
                id: 'time_off',
                name: 'REST',
                value: restItem ?  restItem.duration : 0,
                label: 'Rest Time (seconds)',
                type: 'number',
            },
            {
                id: 'rest_time',
                name: 'BREAK',
                value: breakItem ?  breakItem.duration : 0,
                label: 'Break Time (seconds)',
                type: 'number',
            },

            {
                id: 'use_voice',
                name: 'use_voice',
                checked: $userSettings.use_voice,
                label: 'Use Voice?',
                type: 'slider',
            },
            {
                id: 'preferred_voice',
                name: 'preferred_voice',
                value: $userSettings.preferred_voice,
                label: 'Preferred Voice',
                type: 'select',
                placeholder: 'Available Voices',
                options: Voice.getVoices(null, true),
            }
        ]};
        return [fieldset];
    };

    const change = event => {
        switch (event.currentTarget.name) {
            case 'PREP':
            case 'WORK':
            case 'REST':
            case 'BREAK':
                const value = parseInt(event.currentTarget.value);
                if (!isNaN(value)) {
                    routine.update($routine=>{
                        $routine.forEach((item, index)=>{
                            if (item.type === routineItemTypes[event.currentTarget.name]) {
                                //Only update pending items
                                if ($routine[index]['elapsed'] !== $routine[index]['duration']) {
                                    $routine[index]['duration'] = value;
                                }
                            }
                        });
                        return $routine;
                    });
                }
                break;
            
            case 'use_voice':
                $userSettings.use_voice = event.currentTarget.checked;
                break;
        
            case 'preferred_voice':
                $userSettings.preferred_voice = event.currentTarget.value;
                Voice.defaultVoice = $userSettings.preferred_voice;
                break;
        }
    }
</script>

<FormPanel on:change={change} on:submit on:click
    id=tabataSettingsForm title='Tabata Settings' fieldsets={fieldsets()} />