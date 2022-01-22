<div class='spinner'></div>

<style lang=scss>
@import 'scss/mixins';
.spinner {
    width: var(--theme-preloader-size);
    height: var(--theme-preloader-size);
    position: relative;

    &::after {
        content: ' ';
        position: absolute;
        @include border-box;
        border: calc(var(--theme-preloader-size)/2) solid var(--theme-text);
        border-color: var(--theme-text) transparent var(--theme-text) transparent;
        border-radius: 50%;
        animation: spinner calc(var(--theme-animation-speed) * 4) infinite;
        @include spinner;
    }
}
</style>