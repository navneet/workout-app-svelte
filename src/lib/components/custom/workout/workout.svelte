<script>
    import { createEventDispatcher } from 'svelte';
    import {secsToClock} from '$lib/cjs/helpers';
    import workout from '$lib/stores/workout/workout';
    import {presets} from '$lib/stores/workout/presets';
    import ViewTitle from '$lib/components/generic/ViewTitle.svelte';
    import SelectDropDown from '$lib/components/generic/selectDropDown.svelte';
    import TimerCounter from '$lib/components/generic/labeledValue.svelte';
    import DisplayList from '$lib/components/custom/workout/displayList.svelte';
    import RoutineMain from "$lib/components/custom/routine/main.svelte";
    import IconButtonBar from '$lib/components/generic/iconButtonBar.svelte';
    import PlayPauseToggleIcon from '$lib/components/custom/music/playPauseToggleIcon.svelte';
    import ShareButton from '$lib/components/custom/workout/shareButton.svelte';

    let settingsOpen, dropdownOpen;
    const dispatch = createEventDispatcher();

    const click = event => {
        switch (event.currentTarget.dataset.action) {
            case 'reset':
                workout.preset = workout.preset;
                break;
            case 'settings_open':
                settingsOpen = true;
                break;
        }
    }

    const onWorkout = () => {
        workout.save(false);
        dispatch('workout');
    }

    const controlBarButtons = () => {
        return [
            {icon:'bi bi-bootstrap-reboot', title:'Reset', data:{'data-action':'reset'}},
            {component:PlayPauseToggleIcon, props:{}},
            {component:ShareButton, props:{}},
            {icon:'bi bi-gear-wide-connected', title:'Timer Settings', data:{'data-action':'settings_open'}},
        ]
    }

    export {settingsOpen};
</script>

<ViewTitle title="{$workout.meta.title ? $workout.meta.title : 'Create'} Workout" />
<SelectDropDown
    label=Presets
    name=preset
    value={$workout.meta.id}
    options={$presets.map(p => [p.get('id'), p.get('title')])}
    on:change={(event) => workout.preset = $presets.find(p => p.get('id') == event.detail)}
    on:open={(event) => dropdownOpen = event.detail}
/>

{#if !dropdownOpen && $workout.exercises.length}
<RoutineMain click={onWorkout} --theme-icon-size='.4rem'>
    <TimerCounter label='Total Time' value={secsToClock(workout.getTotalTime($workout))} />
</RoutineMain>
<IconButtonBar on:click={click} buttons={controlBarButtons()} --theme-icon-size='1.6rem' />
<DisplayList />
<RoutineMain click={onWorkout} --theme-icon-size='.3rem'>
    <TimerCounter label='Total Time' value={secsToClock(workout.getTotalTime($workout))} />
</RoutineMain>
{/if}