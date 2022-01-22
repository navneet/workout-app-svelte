<div>
    <slot></slot>
</div>

<style lang=scss>

div {
    --theme-gap-unit: 1rem;
    --theme-scroll-viewport-height: calc(var(--theme-gap-unit) * 8);
    margin: 0;
    padding: 0;
    max-height: var(--theme-scroll-viewport-height);
    overflow: hidden;
    border: 0 none transparent;
    border-radius: 1%;
    background-color: transparent;
    box-shadow: 0 calc(var(--theme-icon-size)*0.1375) calc(var(--theme-icon-size)*1) .5rem rgba(100, 100, 100, 0.1) inset;
}
</style>