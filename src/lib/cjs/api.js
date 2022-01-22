const API = () => {

    const saveWorkout = async ($workoutObj) => {
        return new Promise(resolve => {
            const init = {
                method: 'POST',
                body: JSON.stringify($workoutObj)
            }
            let url = 'http://localhost:8000'
            url = '/api/workout/save';
            fetch(url, init).then(response=>{
                if (response.ok) resolve();
            }).catch(error=>{
                console.error(error);
            });
        });
    }

    return {
        saveWorkout
    }
}

export default API();