<script>
	import { onDestroy } from 'svelte';
	import {page} from '$app/stores';
	import { SessionStore, LocalStore } from '$lib/stores/storage';
	import routine from '$lib/stores/routine';
	import Preloader from '$lib/components/generic/preloader.svelte';
	import CreateNewButton from '$lib/components/custom/routine/createNewButton.svelte';
	import TabataSettingsForm from '$lib/components/custom/routine/tabataSettings.svelte';
	import Tabata from '$lib/components/custom/routine/tabata.svelte';

	const _loadQueryWorkout = () => {
		return new Promise(async resolve => {
			let url = 'https://kalabaaz.pythonanywhere.com';
			url += `/api/tabata/${$page.url.searchParams.get('w')}.json`;
			try {
				const response = await fetch(url, {credentials: 'include'});
				if (response.ok) {
					const result = await response.json();
					resolve(result);
				}
			} catch (error) {
				console.error(error);
				resolve(null);
			}
		});
	}

	const readySessionRoutine = () => {
		return new Promise(async (resolve, reject) => {
			if ('url' in $page && $page.url.searchParams.has('w')) {
				const result = await _loadQueryWorkout();
				if (!result) return reject();
				LocalStore.setItem('workout', result);
				SessionStore.setItem('routine', []);
			}

			const sess_routine = SessionStore.getItem('routine');
			if (sess_routine.length) {
				routine.set(sess_routine);
			} else {
				const workout = LocalStore.getItem('workout');
				if (workout) routine.setWorkout(workout);
			}

			resolve();
		});
	}

	onDestroy(()=>SessionStore.setItem('routine', $routine));

	let open;
</script>

<svelte:head>
	<title>SWEAT Tabata</title>
</svelte:head>

{#await readySessionRoutine()}
	<div class=center><Preloader /></div>
{:then} 
{#if $routine.length}
	{#if open}
	<TabataSettingsForm on:click={()=>open=!open} on:submit={()=>open=!open} />
	{:else}
	<Tabata bind:settingsOpen={open} />
	{/if}
{:else}
	<CreateNewButton>
		<h2 class=center>No Workout!</h2>
		<p>You need of a workout.<br>Please create one.</p>
	</CreateNewButton>
{/if}
{:catch}
<CreateNewButton>
	<h2 class='center error'>Workout not found!</h2>
	<p>The workout you are looking for was not found.<br>Perhaps it has expired. Please create a new one.</p>
</CreateNewButton>
{/await}