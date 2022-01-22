<script context=module>
    import {get} from 'svelte/store';
    import WorkoutDb from '$lib/stores/workout/db';
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({fetch}) {
        const props = {xml:null};
        const db = get(WorkoutDb);
        if (!db) {
            const response = await fetch('/data/workout_list.xml');
            if (response.ok) props.xml = await response.text();
        }
		return {props};
	}
</script>

<script>
    export let xml;
    import {goto} from '$app/navigation';
    import {SessionStore} from '$lib/stores/storage';
    import ViewTitle from '$lib/components/generic/ViewTitle.svelte';
    import WorkoutSettingsForm from '$lib/components/custom/workout/settingsForm.svelte';
    import Workout from '$lib/components/custom/workout/workout.svelte';

    const onGoWorkout = () => {
        SessionStore.setItem('routine', []);
        goto('/routine/tabata');
    }

    if (xml) WorkoutDb.setDb(xml);
    let open = false;
</script>

<svelte:head>
	<title>SWEAT Workout</title>
</svelte:head>

{#if $WorkoutDb}
    {#if open}
        <ViewTitle title='Customize Workout' />
        <WorkoutSettingsForm bind:open />
    {:else}
        <Workout bind:settingsOpen={open} on:workout={onGoWorkout} />
    {/if}
{:else}
<h2 class='center error'>
    Unable to connect to database
</h2>
<p>This is embarrassing! I'm unable to connect to the database.</p>
<p>Please try again later. Sorry!</p>
{/if}