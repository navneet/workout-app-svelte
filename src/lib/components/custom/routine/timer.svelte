<script>
    import {onMount} from 'svelte';
    import Voice from '$lib/cjs/Voice';
    import AppStore from '$lib/stores/appStore';
    import TimeKeeper from '$lib/stores/TimeKeeper';
	import MainView from "$lib/components/custom/routine/main.svelte";
    import TimerCounter from '$lib/components/generic/labeledValue.svelte';
    import IconButtonBar from '$lib/components/generic/iconButtonBar.svelte';
    import PlayPauseMusic from '$lib/components/custom/music/playPauseToggleIcon.svelte';

    let value, settingsOpen, planks;
    const userSettings = AppStore.userSettings;
    const timerState = AppStore.routine;
    const docBodyBgColor = AppStore.docBodyBgColor;
    const timeKeeper = TimeKeeper();

    const controlBarClick = event => {
        switch (event.currentTarget.dataset.action) {
            case 'reset':
                timeKeeper.reset();
                break;
            case 'settings_open':
                if (timeKeeper.isTicking()) timeKeeper.stop();
                settingsOpen = true;
                break;
        }
    }

    const controlBarButtons = () => {
        return [
            {icon:'bi bi-bootstrap-reboot', title:'Reset', data:{'data-action':'reset'}},
            {component:PlayPauseMusic, props:{}},
            {icon:'bi bi-gear-wide-connected', title:'Timer Settings', data:{'data-action':'settings_open'}},
        ];
    }

    onMount(()=> {
        timeKeeper.set($timerState.stopTime);
        return () => {
            tksub();
            $timerState.stopTime = $timeKeeper;
            docBodyBgColor.set(null);
        }
    });

    const tksub = timeKeeper.subscribe($timeKeeper => {
        const elapsed = $timeKeeper - $userSettings.prep_time;
        const display = elapsed < 0 ? Math.abs(elapsed) : elapsed;
        if (!timeKeeper.isTicking()) {
            value = elapsed > 0 ? timeKeeper.asClock(display) : 0;
            docBodyBgColor.set(null);
            return;
        }

        if ($userSettings.use_voice) {
            let utterance = '';
            switch (elapsed) {
                case 0:
                    utterance += 'Go';
                    break;
                case -1:
                case -2:
                case -3:
                    utterance += display.toString();
                    break;

                default:
                    const announce_every = $userSettings.announce_every;
                    if (announce_every > 0 && display % announce_every === 0) {
                        const {m, s} = timeKeeper.minSecs(display);
                        if (m !== 0) utterance += m + ' minute' + (m == 1 ? ' ' : 's ');
                        if (s !== 0) utterance += s + ' second' + (s == 1 ? '' : 's');
                    }
                    break;
            }
            if (utterance.length) Voice.speak(utterance);
        }

        if (elapsed < 0) {
            value = display;
            docBodyBgColor.set('PREP');
        } else {
            value = timeKeeper.asClock(display);
            docBodyBgColor.set('WORK');
        }
    });
    export {settingsOpen, planks};
</script>

<MainView {timeKeeper} {value}>
    {#if $userSettings.show_plank}
    <TimerCounter label=Plank value={planks} />
    {/if}
</MainView>
<IconButtonBar on:click={controlBarClick} buttons={controlBarButtons()} --theme-icon-size='1.6rem' />