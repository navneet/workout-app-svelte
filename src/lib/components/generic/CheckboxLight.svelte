<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let name, label;
    let checked = false;
    export {name, label, checked};
</script>

<div>
    <label class=bulb-label for={name}>{label}</label>
    <input
        bind:checked={checked}
        type=checkbox name={name} id={name}
        on:change={(event) => dispatch('change', event)}>
    <label class=bulb for={name}></label>
</div>

<style lang=scss>
div {
    display: flex;
    align-items: center;
    input[type=checkbox] {display: none}
    
    label {
        &.bulb-label {
            text-transform: uppercase;
            margin-right: 1rem;
            flex: 2 1 70%;
        }

        &.bulb {
            width: 0.7rem;
            height: 0.7rem;
            border-radius: 50%;
            background: -webkit-linear-gradient(#fcc4c5,#e12c2d);
            background: linear-gradient(#fcc4c5,#e12c2d);
            box-shadow: inset -1px -1px 4px #8d0808, 
                        inset 1px 1px 2px #bb1313;
            cursor: pointer;
        }
    }

    input[type=checkbox]:checked + .bulb {
        background: -webkit-linear-gradient(#d8eec4,#5fa718);
        background: linear-gradient(#d8eec4,#5fa718);
        box-shadow: inset -1px -1px 4px #417f0b, 
                    inset 1px 1px 2px #5b9f1a;	
    }
}
</style>