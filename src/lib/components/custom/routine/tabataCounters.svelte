<script>
    import { onDestroy } from 'svelte';
    import {secsToClock} from '$lib/cjs/helpers';
    import routine from '$lib/stores/routine';
    import TimerCounter from '$lib/components/generic/labeledValue.svelte';
    
    let elapsed = '00:00';
    let remaining = '00:00';
    let cycles = '0/0';
    let tabatas = '0/0';

    const rSub = routine.subscribe($routine => {
        if (!$routine.length) return;
        const currentIndex = $routine.findIndex(item => item.elapsed < item.duration);
        if (currentIndex === -1) return;
        const elapsedSecs = $routine.reduce((p, item) => p + item.elapsed, 0);
        const totalSecs = $routine.reduce((p, item) => p + item.duration, 0);
        elapsed = secsToClock(elapsedSecs);
        remaining = secsToClock(totalSecs-elapsedSecs);
        cycles = $routine[currentIndex].cycle + '/' + $routine[$routine.length-1].cycle;
        tabatas = $routine[currentIndex].round + '/' + $routine[$routine.length-1].round;
    });

    onDestroy(()=>rSub());
</script>

<div>
    <TimerCounter label=Elapsed value={elapsed} />
    <TimerCounter label=Remaining value={remaining} />
    <TimerCounter label=Cycles value={cycles} />
    <TimerCounter label=Tabatas value={tabatas} />
</div>

<style lang=scss>
div {
    flex: 0 0 40%;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-around;
    gap: calc(var(--theme-font-size) * .5);
}
</style>