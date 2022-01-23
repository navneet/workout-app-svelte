<script>
    import {page} from '$app/stores';
    import AppStore from '$lib/stores/appStore';
    import workout from '$lib/stores/workout/workout';
    import { LocalStore } from '$lib/stores/storage';
    import { EXERCISE_TYPE } from "$lib/stores/workout/types";
    import IconButton from '$lib/components/generic/iconButton.svelte';
    import Tooltip from '$lib/components/generic/Tooltip.svelte';

    const routineState = AppStore.routine;
    let tooltipBody = '';
    let tooltipShow = false;
    
    const click = async () => {
        if (!$workout[EXERCISE_TYPE.EXERCISE].length) {
            const lsWorkout = LocalStore.getItem('workout');
            if (lsWorkout) workout.set(lsWorkout);
        }

        if (!$workout.meta.pathname && $workout[EXERCISE_TYPE.EXERCISE].length) {
            workout.save(true);
        }

        if ($workout.meta.pathname) {
            const shareLink = {
                title: `Sweat Workout`,
                text: 'Here\'s the link to your saved workout.',
                url: `${$page.url.origin}${$routineState.tabataLink}/?w=${$workout.meta.pathname}&`,
            };
            if ('canShare' in navigator && navigator.canShare(shareLink)) {
                await navigator.share(shareLink);
            } else if('clipboard' in navigator) {
                await navigator.clipboard.writeText(shareLink.url);
                if (!tooltipShow) {
                    tooltipBody = 'Link Copied!';
                    tooltipShow = true;
                }
            }
        }
    }

    const getShareIconImage = () => {
        const canShare = 'canShare' in navigator && navigator.canShare();
        return {
            icon:`bi bi-${canShare ? 'share-fill' : 'link'}`,
            title:'Share'
        }
    }

</script>

<IconButton on:click={click} {...getShareIconImage()}/>
{#if tooltipShow}
<Tooltip bind:show={tooltipShow} body={tooltipBody} />
{/if}