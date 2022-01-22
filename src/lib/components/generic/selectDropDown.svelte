<script>
    import { onMount, createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    const getDataText = () => {
        const self = document.getElementById(name);
        if (!self) return null;
        let dataText = '';
        self.querySelectorAll('.sel-box-option').forEach(el => {
            if (el['dataset']['value'] == value) {
                dataText = el['dataset']['label'];
            }
        });
        return dataText;
    }

    const setLabel = (label) => {
        const pHolder = document.getElementById(name).querySelector('.sel-placeholder');
        pHolder.textContent = label;
    }

    const onOptionClick = event => {    
        if (event.currentTarget.dataset.value == value)
            return;
        
        value = event.currentTarget.dataset.value;
        setLabel(event.currentTarget.dataset.placeholder);
        dispatch('change', value);
    }

    const onSelClick = () => {
        active = !active;
        dispatch('open', active);
    }

    onMount(() => {
        const displayTitle = getDataText();
        if (displayTitle) {
            setLabel(displayTitle);
        }
    })

    let active = false;
    let label, name, value, options;
    export {label, name, value, options}
</script>

<div class=sel id={name} class:active on:click={onSelClick}>
    <span class=sel-placeholder data-label={label}>{label}</span>
    <div class=sel-box>
        {#each options as option}
            <span
                on:click={onOptionClick}
                class=sel-box-option class:selected={value === option[0]}
                data-value={option[0]} data-placeholder={option[1]}>
                {option[1]}
            </span>
        {/each}
    </div>
</div>

<style lang=scss>
@import 'scss/mixins';

.sel {
    cursor: pointer;
    .sel-placeholder {
        pointer-events: none;
        user-select: none;
        display: block;
        &::before {
            content: attr(data-placeholder);
            display: none;
        }
    }

    .sel-box {
        display: none;
    }

    &.active {
        .sel-placeholder {
            display: none;
            &::before {
                display: initial;
            }
        }

        .sel-box {
            display: flex;
            flex-flow: column nowrap;
            .sel-box-option {
                padding: calc(var(--theme-font-size) * 0.75);
                user-select: none;
                &::after {display: none}
                &.selected {
                    &::after {display: initial}
                }
            }
        }
    }
}

.sel {
    @include bottom-border;

    &::before {
        content: url('/css/icons/arrow-down-right.svg');
        transform: rotateX(0);
        opacity: 1;
        transition: all calc(var(--theme-animation-speed) * 0.8) ease-in;
    }

    &.active {
        &::before {
            transform: rotateX(-180deg);
            opacity: 0;
        }

        .sel-box {
            animation: fadeInUp var(--theme-animation-speed);
            @include fadeInUp;
            .sel-box-option {
                font-size: calc(var(--theme-font-size) * 1.15);
                &::after {
                    content: url('/css/icons/arrow-left.svg');
                }
                &:hover {background-color: var(--theme-highlight-color)}
            }
        }
    }

    .sel-placeholder {
        font-size: calc(var(--theme-font-size) * 1.75);
    }

    .sel-box {
        @include light-shadow;
    }
}
</style>