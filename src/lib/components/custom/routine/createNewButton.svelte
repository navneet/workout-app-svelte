<script>
import {goto} from '$app/navigation';
import LabeledInput from '$lib/components/generic/labeledInput.svelte';
</script>

<slot></slot>
<LabeledInput
    label='Create New Workout'
    type=button
    name=create id=create
    on:click={()=>goto('/workout', {replaceState:true})}/>