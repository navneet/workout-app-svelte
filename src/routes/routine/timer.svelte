<script>
    import { LocalStore } from '$lib/stores/storage';
    import TimerSettingsForm from '$lib/components/custom/routine/timerSettings.svelte';
    import Timer from "$lib/components/custom/routine/timer.svelte";

    const planks = () => {
        const workout = LocalStore.getItem('workout');
        const pl = workout && 'planks' in workout ? workout.planks : [];
        return pl.map(p=>p.display_name);
    }

    let open = false;
</script>

<svelte:head>
	<title>SWEAT Timer</title>
</svelte:head>

{#if open}
    <TimerSettingsForm on:click={()=>open=!open} on:submit={()=>open=!open} />
{:else}
    <Timer bind:settingsOpen={open} planks={planks()} />
{/if}