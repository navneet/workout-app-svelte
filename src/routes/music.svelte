<script>
    import {onMount} from 'svelte';
    import AppStore from '$lib/stores/appStore';
    import ViewTitle from '$lib/components/generic/ViewTitle.svelte';
    onMount(() => {
        $musicState.showPlayer = true;
        return () => $musicState.showPlayer = false;
    });
    const musicState = AppStore.music;
</script>

<svelte:head>
	<title>SWEAT Music</title>
</svelte:head>

<ViewTitle title=Music />