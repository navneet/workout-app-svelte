<script context=module>
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({url, fetch}) {
		const props = {queryWorkout: undefined}
		if (url.searchParams.has('w')) {
			const result = await fetchWorkout(url.searchParams.get('w'), fetch)
			props.queryWorkout = result ? result : null;
		}
        return {props};
	}

    const fetchWorkout = (pathstem, customFetch=null) => {
        return new Promise(async resolve => {
            if (!customFetch) customFetch = fetch;
            let result = null;
            let url = 'https://kalabaaz.pythonanywhere.com';
            url += `/api/tabata/${pathstem}.json`;
            const response = await customFetch(url, {credentials: 'include'});
            if (response.ok)
                result = await response.json();
            resolve(result);
        })
    }
</script>
<script>
	export let queryWorkout=undefined;
	import { onDestroy } from 'svelte';
	import {goto} from '$app/navigation';
	import {page} from '$app/stores';
	import AppStore from '$lib/stores/appStore';
	import { SessionStore, LocalStore } from '$lib/stores/storage';
	import routine from '$lib/stores/routine';
	import TabataSettingsForm from '$lib/components/custom/routine/tabataSettings.svelte';
	import Tabata from '$lib/components/custom/routine/tabata.svelte';
	import LabeledInput from '$lib/components/generic/labeledInput.svelte';

	let open;
	let failed2Load = $page.url.searchParams.has('w') && queryWorkout === null;
	const routineState = AppStore.routine;

	if (queryWorkout) {
		LocalStore.setItem('workout', queryWorkout);
		SessionStore.setItem('routine', []);
		goto($routineState.tabataLink, {replaceState:true});
	} else if(!failed2Load) {
		const sess_routine = SessionStore.getItem('routine');
		if (sess_routine.length) {
			routine.set(sess_routine);
		} else {
			const workout = LocalStore.getItem('workout');
			if (workout) routine.setWorkout(workout);
		}
		onDestroy(()=>SessionStore.setItem('routine', $routine))
	}
</script>

<svelte:head>
	<title>SWEAT Tabata</title>
</svelte:head>

{#if failed2Load || !$routine.length}
	{#if failed2Load}
	<h2 class=center>Workout not found!</h2>
	<p>The workout you are looking for was not found.<br>Perhaps it has expired. Please create a new workout</p>
	{:else}
	<h2 class=center>No Workout!</h2>
	<p>You are in need of a workout.<br>Please create one.</p>
	{/if}
	<LabeledInput
		label='Create New Workout'
		type=button
		name=create id=create
		on:click={()=>goto('/workout', {replaceState:true})}
	/>
{:else if !$page.url.searchParams.has('w')}
	{#if open}
	<TabataSettingsForm on:click={()=>open=!open} on:submit={()=>open=!open} />
	{:else if $routine.length}
	<Tabata bind:settingsOpen={open} />
	{/if}
{/if}