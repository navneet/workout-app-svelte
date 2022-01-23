<script>
	import { onDestroy } from 'svelte';
	import {derived} from 'svelte/store';
	import Voice from '$lib/cjs/Voice';
	import AppStore from '$lib/stores/appStore';
	import routine from '$lib/stores/routine';
	import { routineItemTypes } from "$lib/stores/workout/types";
    import TimeKeeper from '$lib/stores/TimeKeeper';
	import MainView from "$lib/components/custom/routine/main.svelte";
	import TabataCounters from '$lib/components/custom/routine/tabataCounters.svelte';
    import IconButtonBar from '$lib/components/generic/iconButtonBar.svelte';
    import PlayPauseMusic from '$lib/components/custom/music/playPauseToggleIcon.svelte';
    import ShareButton from '$lib/components/custom/workout/shareButton.svelte';
	import RoutineScroller from '$lib/components/custom/routine/routineScroller.svelte';

	let settingsOpen = false;
    let toggleActive;
    const userSettings = AppStore.userSettings;
	const docBodyBgColor = AppStore.docBodyBgColor;
	const timeKeeper = TimeKeeper();

	const getBgClass = index => Object.entries(routineItemTypes).reduce(
            (p, c) => c[1] === $routine[index].type ? c[0] : p, null);
	const getCurrentIndex = () => $routine.findIndex(item => item.elapsed < item.duration);

    const nextExerciseSpeech = () => {
        const nextEx = $routine.findIndex(item => item.type === routineItemTypes.WORK && item.elapsed === 0);
        if (nextEx === -1) return '';
        const item = $routine[nextEx];
        let speech = `Next Exercise is ${item.display_name}\n`;
        if (item.band_pos > 0)
            speech += `Band's Position: ${item.band_pos_text}`;
        return speech;
    }

	const remaining = derived(routine, $routine => {
		if (!$routine.length || !routine.hasStarted()) return 0;
		const cIndex = getCurrentIndex();
		if (cIndex === -1) return 0;
		const currentItem = $routine[cIndex];
		return currentItem.duration - currentItem.elapsed;
	});

    const speaker = ($remaining) => {
        if (!$userSettings.use_voice || !timeKeeper.isTicking()) return;
		const cIndex = getCurrentIndex();
		if (cIndex === -1) return;

		let utterance = '';
		const currentItem = $routine[cIndex];
        switch (currentItem.elapsed) {
            case 0:
                switch(currentItem.type) {
                    case routineItemTypes.WORK:
                        utterance += 'Go\n';
                        break;
                    case routineItemTypes.REST:
                    case routineItemTypes.BREAK:
                        utterance += 'Stop\n';
                        break;
                }
                break;
        
            case 1:
                switch(currentItem.type) {
                    case routineItemTypes.REST:
                        utterance += 'Rest\n';
                        break;
                    case routineItemTypes.BREAK:
                        utterance += 'Break\n';
                        break;
                    case routineItemTypes.PREP:
                        utterance += 'Prep\n';
                        break;
                }
                break;
            
            case 2:
                switch(currentItem.type) {
                    case routineItemTypes.REST:
                    case routineItemTypes.PREP:
                        utterance += nextExerciseSpeech();
                        break;
                }
                break;
        }
		
        if ($remaining < 4) {
            utterance += `${$remaining}\n`;
		} else if (currentItem.type === routineItemTypes.BREAK) {
            switch ($remaining) {
                case 14:
                    utterance += nextExerciseSpeech();
                    break;
                case 15:
                    utterance += 'Get Ready\n';
                    break;
            }
		} else if (routine.isComplete()) {
			utterance += 'Well done\n';
		}

        if (utterance.length) Voice.speak(utterance);
    }

    const bgSetter = ($remaining) => {
        const cIndex = getCurrentIndex();
		if (cIndex == -1 || $timeKeeper === 0) {
			docBodyBgColor.set(null);
		} else if (
			(timeKeeper.isTicking() && !document.body.classList.length) ||
			($remaining === $routine[cIndex].duration))
		{
			docBodyBgColor.set(getBgClass(cIndex));
		}
    }

    const controlBarClick = event => {
        if (timeKeeper.isTicking()) timeKeeper.stop();
        switch (event.currentTarget.dataset.action) {
            case 'reset':
                toggleActive = false;
                timeKeeper.reset();
                routine.reset();
                break;
            case 'settings_open':
                settingsOpen = true;
                break;
        }
    }

    const controlBarButtons = () => {
        return [
            {icon:'bi bi-bootstrap-reboot', title:'Reset', data:{'data-action':'reset'}},
            {component:PlayPauseMusic, props:{}},
            {component:ShareButton, props:{}},
            {icon:'bi bi-gear-wide-connected', title:'Timer Settings', data:{'data-action':'settings_open'}},
        ];
    }

    const tksub = timeKeeper.subscribe(()=>{
		const cIndex = getCurrentIndex();
		if (cIndex !== -1 && timeKeeper.isTicking())
			$routine[cIndex].elapsed += 1;
	});

	const rSub = remaining.subscribe($remaining => {
		speaker($remaining);
        bgSetter($remaining);
	});

    onDestroy(()=>{
        tksub();
        rSub();
        docBodyBgColor.set(null);
	});

    export {settingsOpen};
</script>

<MainView bind:active={toggleActive} {timeKeeper} value={$remaining}>
    <TabataCounters />
</MainView>
<IconButtonBar on:click={controlBarClick} buttons={controlBarButtons()} --theme-icon-size='1.6rem' />
<RoutineScroller active={toggleActive} />