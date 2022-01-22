<script context=module>
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({params, fetch}) {
        const props = {slug_workout: await fetchSlugWorkout(params.slug, fetch)}
        return {props};
	}

    const fetchSlugWorkout = (slug, customFetch=null) => {
        return new Promise(async resolve => {
            if (!customFetch) customFetch = fetch;
            let result = null;
            let url = 'https://kalabaaz.pythonanywhere.com';
            url = `/api/tabata/${slug}.json`;
            const response = await customFetch(url, {credentials: 'include'});
            if (response.ok)
                result = await response.json();
            resolve(result);
        })
    }
</script>

<script>
    export let slug_workout;
    import {goto} from '$app/navigation';
    import { SessionStore, LocalStore } from '$lib/stores/storage';
    import LabeledInput from '$lib/components/generic/labeledInput.svelte';
    import Index from './index.svelte';

    if (slug_workout) {
        LocalStore.setItem('workout', slug_workout);
        SessionStore.setItem('routine', []);
    }
</script>

<svelte:head>
    {#if !slug_workout}
    <title>SWEAT Error 404</title>
    {/if}
</svelte:head>

{#if slug_workout}
<Index />
{:else}
<h2 class=center>Workout not found!</h2>
<p>The workout you are looking for was not found.<br>Perhaps it has expired. Please create a new workout</p>
<LabeledInput
    label='Create New Workout'
    type=button
    name=create id=create
    on:click={()=>goto('/workout', {replaceState:true})}
/>
{/if}