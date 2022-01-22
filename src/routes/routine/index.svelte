<script>
    import {goto} from '$app/navigation';
    import AppStore from '$lib/stores/appStore';
    const routineState = AppStore.routine;
    goto($routineState.currentLink, {replaceState: true});
</script>