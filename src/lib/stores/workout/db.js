import {writable} from "svelte/store";

const WorkoutDb = () => {
    const {subscribe, set} = writable(null);

    const setDb = (xml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');
        const errorNode = doc.querySelector('parsererror');
        errorNode ? set(errorNode) : set(doc);
    }

    return {subscribe, setDb};
}

export default WorkoutDb();