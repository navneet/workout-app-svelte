<script>
let href = null;
let title = null;
let icon = null;
let src = null;
let alt = '';
let disabled = false;
let active = false;
let hide = false;
let data = {};
export {href, title, icon, src, alt, disabled, active, hide, data}
</script>

{#if href}
<a
    on:click on:dblclick
    on:mouseenter on:mouseleave
    class:active
    class:hide {href} {title} {...data}>
    <i class={icon}></i>
</a>
{:else}
<button
    on:click on:dblclick
    on:mouseenter on:mouseleave
    {disabled}
    class:active
    class:hide
    {...data}>
    {#if src}
    <img src={src} alt={alt}>
    {:else if icon}
    <i class={icon} {title}></i>
    {:else}
    <slot></slot>
    {/if}
</button>
{/if}

<style lang=scss>
@use 'scss/button';
a, button {
    @include button.shadow-button;
    padding: calc(var(--theme-icon-size) * 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active, &.active {
        outline: 0;
        box-shadow: button.$active-shadow;
        i {opacity:1}
        
    }
    i {
        opacity: 0.7;
        transition: opacity calc(var(--theme-animation-speed)/2) ease-in-out;
        &:hover {opacity: .9}
    }
}

img {
    min-width: var(--theme-icon-size);
    min-height: var(--theme-icon-size);
}

i {
    font-size: var(--theme-icon-size);
}
</style>