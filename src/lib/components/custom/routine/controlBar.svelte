<script>
    import IconButtonBar from '$lib/components/generic/iconButtonBar.svelte';
    import PlayPauseToggleIcon from '$lib/components/custom/music/playPauseToggleIcon.svelte';

    const onClick = event => {
        switch (event.currentTarget.dataset.action) {
            case 'reset':
                timeKeeper.reset();
                break;
            case 'settings_open':
                if (timeKeeper.isTicking()) timeKeeper.stop();
                $timerState.settingsOpen = true;
                break;
        }
    }

    let buttons = [
        {icon:'bi bi-bootstrap-reboot', title:'Reset', data:{'data-action':'reset'}},
        {component:PlayPauseToggleIcon, props:{}},
        {icon:'bi bi-gear-wide-connected', title:'Timer Settings', data:{'data-action':'settings_open'}},
    ];
    let timeKeeper = null;
    let timerState = null;
    let click = null;
    let hide = false;
    export {timeKeeper, timerState, hide, buttons, click};
</script>

<IconButtonBar on:click={click ? click : onClick} {buttons} {hide} --theme-icon-size='1.6rem' />