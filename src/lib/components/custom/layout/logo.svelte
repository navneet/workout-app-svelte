<script>
    export let shrink = false;
</script>
<a href=/ title=Home class=logo class:shrink>
    <h1>Sweat</h1>
    <i class="bi bi-moisture"></i>
</a>

<style lang=scss>
a {
    display: flex;
    align-items: center;
    column-gap: calc(var(--theme-font-size) * .5);

    &.shrink {
        transform: scale(60%);
        transition: transform var(--theme-animation-speed) ease;
    }

    h1 {
        font-style: oblique;
        text-transform: uppercase;
    }

    h1, i {
        font-size: calc(var(--theme-font-size) * 2.2);
    }
}
</style>