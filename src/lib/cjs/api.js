const API = () => {

    const saveWorkout = async ($workoutObj) => {
        return new Promise(resolve => {
            const init = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify($workoutObj),
                credentials: 'include'
            }
            let url = 'https://kalabaaz.pythonanywhere.com'
            url += '/api/workout/save';
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