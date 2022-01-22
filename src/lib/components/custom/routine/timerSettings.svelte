<script>
    import AppStore from '$lib/stores/appStore';
    import Voice from '$lib/cjs/Voice';
    import FormPanel from '$lib/components/generic/formPanel.svelte';

    const userSettings = AppStore.userSettings;

    const change = event => {
        switch (event.currentTarget.name) {
            case 'prep_time':
            case 'announce_every':
                const value = parseInt(event.currentTarget.value);
                if (!isNaN(value)) $userSettings[event.currentTarget.name] = value;
                break;
            
            case 'show_plank':
            case 'use_voice':
                $userSettings[event.currentTarget.name] = event.currentTarget.checked;
                break;
        
            case 'preferred_voice':
                $userSettings.preferred_voice = event.currentTarget.value;
                Voice.defaultVoice = $userSettings.preferred_voice;
                break;
        }
    }

    const getFieldsets = () => {
        const fieldset = {legend:'Update', inputs:[
            {
                id: 'prep_time',
                name: 'prep_time',
                value: $userSettings.prep_time,
                label: 'Prep Time (seconds)',
                type: 'number',
            },
            {
                id: 'announce_every',
                name: 'announce_every',
                value: $userSettings.announce_every,
                label: 'Announce Every (seconds)',
                type: 'number',
            },
            {
                id: 'show_plank',
                name: 'show_plank',
                checked: $userSettings.show_plank,
                label: 'Show Planks?',
                type: 'slider',
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
    }
</script>

<FormPanel
    id=timerSettingsForm
    on:change={change}
    on:submit
    on:click
    title='Timer Settings' fieldsets={getFieldsets()} />