<script context="module">
    export const load = ({error, status}) => {
        return {props: {error:error, status: status}};
    }
</script>

<script>
    const stackList = (stack) => stack.split('\n');
	let error, status;
    export {error, status};
</script>

<svelte:head>
	<title>SWEAT Error {status}</title>
</svelte:head>

<h2>{status}</h2>
{#if error.stack}
<ol>
    {#each stackList(error.stack) as stackLine}
        <li><pre>{stackLine}</pre></li>
    {/each}
</ol>
{:else}
<div>{error.message}</div>
{/if}

<style>
h2 {
    color: brown;
}

pre {
    font-family: 'Courier New', Courier, monospace;
}
</style>