const EXERCISE_TYPE = {
    EXERCISE: 'exercises',
    PLANK: 'planks',
}

const ExerciseObject = (inputObj={}) => {
    const outputObj = Object.preventExtensions({
        name: '',
        display_name: '',
        type: EXERCISE_TYPE.EXERCISE,
        region: '',
        target: '',
        has_lr: false,
        band_pos: 0,
        band_pos_text: '',
    });
    return Object.assign(outputObj, inputObj);
};

const RoutineItem = (inputObj=null) => {
    const outputObj = Object.preventExtensions(Object.assign({
        elapsed: 0,
        duration: 0,
        cycle: 0,
        round: 0,
    }, ExerciseObject()));
    return inputObj ? Object.assign(outputObj, inputObj) : outputObj;
};

const routineItemTypes = {
    PREP: -3,
    BREAK: -2,
    REST: -1,
    WORK: 1
};

const routine2exercise = routineItem => {
    const exObj = ExerciseObject();
    Object.keys(exObj).forEach(k=>exObj[k]=routineItem[k])
    return exObj;
}

export {EXERCISE_TYPE, ExerciseObject, RoutineItem, routineItemTypes, routine2exercise};