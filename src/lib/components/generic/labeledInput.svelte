<script>
import SliderSwitch from '$lib/components/generic/sliderSwitch.svelte';
import Preloader from '$lib/components/generic/preloader.svelte';
let label, name;
let bindValue = false;
let type = 'number';
let value = null;
let id = null;
let disabled = false;
let readonly = false;
export {label, name, id, value, type, readonly, disabled, bindValue};

if (['reset', 'submit'].includes(type) && bindValue) {
    bindValue = false;
}
</script>

{#if (['button', 'reset', 'submit'].includes(type))}
    {#if ['reset', 'submit'].includes(type)}
    <input on:focus on:blur on:click {type} {id} {name} {disabled} {readonly} value={value || label}>
    {:else if type === 'button'}
    <button on:focus on:blur on:click {type} {id} {name} {disabled} {readonly} class:active={readonly}>{value || label}</button>
    {/if}
{:else}
<label class:readonly for={name}>{label}</label>
{/if}

{#if bindValue}
    {#if type === 'number'}
    <input type=number on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
    {:else if type === 'text'}
    <input type=text on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
    {:else if type === 'password'}
    <input type=password on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
    {:else if type === 'email'}
    <input type=email on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
    {:else if type === 'url'}
    <input type=url on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
    {:else if type === 'select'}
        {#if 'options' in $$props}
            {#if 'then' in $$props.options}
                {#await $$props.options}
                <Preloader --theme-preloader-size='var(--theme-font-size)' />
                {:then options}
                <select on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
                    {#each options as option}
                    <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
                {/await}
            {:else}
            <select on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
                {#each $$props.options as option}
                <option value={option.value}>{option.label}</option>
                {/each}
            </select>
            {/if}
        {:else}
        <select on:input on:change on:focus on:blur bind:value={value} {id} {name} {disabled} {readonly}>
            <slot name=selectOptions></slot>
        </select>
        {/if}
    {:else if type === 'slider'}
    <SliderSwitch on:change bind:checked={$$props.checked} {id} {name} {disabled} />
    {/if}
{:else}
    {#if ['email', 'text', 'password', 'number', 'url'].includes(type)}
    <input on:input on:change on:focus on:blur {value} {type} {id} {name} {disabled} {readonly}>
    {:else if type === 'select'}
        {#if 'options' in $$props}
            {#if 'then' in $$props.options}
                {#await $$props.options}
                <Preloader --theme-preloader-size='var(--theme-font-size)' />
                {:then options}
                <select on:input on:change on:focus on:blur {value} {id} {name} {disabled} {readonly}>
                    {#each options as option}
                    <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
                {/await}
            {:else}
            <select on:input on:change on:focus on:blur {value} {id} {name} {disabled} {readonly}>
                {#each $$props.options as option}
                <option value={option.value}>{option.label}</option>
                {/each}
            </select>
            {/if}
        {:else}
        <select on:input on:change on:focus on:blur {value} {id} {name} {disabled} {readonly}>
            <slot name=selectOptions></slot>
        </select>
        {/if}
    {:else if type === 'slider'}
    <SliderSwitch on:change checked={$$props.checked} {id} {name} {disabled} />
    {/if}
{/if}

<style lang=scss>
@use 'scss/button';
button, input[type=button], input[type=reset], input[type=submit] {
    @include button.shadow-button;
}

label {
    font-size: var(--theme-font-size);
    flex: 1;
    min-width: max-content;
    &.readonly {font-weight: bolder}
}

input, select {
    margin:0;
    border:0;
    outline: 0;
    flex: 0;
    padding: calc(var(--theme-font-size) / 6) calc(var(--theme-font-size) / 4);
}

select {
    min-width: fit-content;
    text-align: right;
    border: 1px ridge rgb(0 0 0 / 20%);
}

input[type=text],
input[type=number],
input[type=email],
input[type=password],
input[type=url] {
    font-size: var(--theme-font-size);
    opacity: 0.6;
    background:none;
    text-align: right;
    border: 1px solid rgb(100 100 100 / 0);
    &:focus, &:active {
        border: 1px solid rgb(100 100 100 / 50%);
        opacity: 1;
    }

    &:read-only{
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
        opacity: 1;
        &:focus, &:active {
            border: initial;
        }
    }
}

input[type=number] {
    max-width: calc(var(--theme-font-size) * 3);
    -moz-appearance: textfield;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
}
</style>