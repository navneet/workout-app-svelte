<script>
    import IconButton from '$lib/components/generic/iconButton.svelte';
    import LabelInput from '$lib/components/generic/labeledInput.svelte';
    let title = '';
    let id = null;
    let action = null;
    let method = 'POST';
    let fieldsets = [{
        legend: '',
        inputs: []
    }];
    export {title, id, action, method, fieldsets};
</script>

<div class=form-panel>
    <div class=title-bar>
        {#if title}
        <h4>{title}</h4>
        {:else}
        <slot name=title></slot>
        {/if}
        <div class=close-button>
            <IconButton on:click icon='bi bi-x' title='Close Settings' --theme-icon-size='1.3rem' />
        </div>
    </div>
    <form on:submit {id} {action} {method}>
        {#if fieldsets.length}
        {#each fieldsets as fieldset}
        <fieldset>
            {#if 'legend' in fieldset}
            <legend>{fieldset.legend}</legend>
            {/if}
            <ul>
            {#each fieldset.inputs as input}
                <li>
                    {#if input.bindValue}
                    <LabelInput on:input on:change on:focus on:blur on:click bind:value={input.value} {...input} />
                    {:else}
                    <LabelInput on:input on:change on:focus on:blur on:click {...input} />
                    {/if}
                </li>
            {/each}
            </ul>
        </fieldset>
        {/each}
        {:else}
        <slot></slot>
        {/if}
    </form>
</div>

<style lang=scss>
@import 'scss/mixins';
div.form-panel {
    @include card-background;
}

/**Layout*/
div.form-panel {
    display: flex;
    flex-flow: column nowrap;
    .title-bar { //Title bar
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        h4 {
            margin-left: calc(var(--theme-font-size)*1.1);
            font-size: calc(var(--theme-font-size)*0.9);
            text-transform: uppercase;
        }
    }

    form {
        display: flex;
        flex-flow: column nowrap;
        row-gap: calc(var(--theme-font-size)*2);
        fieldset {
            padding: calc(var(--theme-font-size)*1.25);
            ul {
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                row-gap: calc(var(--theme-font-size)*1.25);
                li {
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
}

form {
    $border: calc(var(--theme-font-size) * 0.1) dashed rgba(150, 150, 150, 0.6);
    fieldset {
        border-top: $border;
        li {border-bottom: $border}
    }
}

legend {
    text-transform: uppercase;
    @include shadow-text;
}
</style>