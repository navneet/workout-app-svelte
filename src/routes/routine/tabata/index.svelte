<script>
	import { onMount } from 'svelte';
	import {goto} from '$app/navigation';
	import { SessionStore, LocalStore } from '$lib/stores/storage';
	import routine from '$lib/stores/routine';
	import TabataSettingsForm from '$lib/components/custom/routine/tabataSettings.svelte';
	import Tabata from '$lib/components/custom/routine/tabata.svelte';
	let open;
	onMount(()=>{
		const sess_routine = SessionStore.getItem('routine');
		if (sess_routine.length) {
			routine.set(sess_routine);
		} else {
			const workout = LocalStore.getItem('workout');
			if (workout) routine.setWorkout(workout);
		}
		if (!$routine.length) goto('/workout', {replaceState: true});
        return () => SessionStore.setItem('routine', $routine);
	});
</script>

<svelte:head>
	<title>SWEAT Tabata</title>
</svelte:head>


{#if open}
    <TabataSettingsForm on:click={()=>open=!open} on:submit={()=>open=!open} />
{:else if $routine.length}
	<Tabata bind:settingsOpen={open} />
{/if}