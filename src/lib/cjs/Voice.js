const _Voice = () => {
    let _defaultVoice = null;
    let _utterance = null;
    let _activated = false;

    function activateOnClick(defaultVoice=null) {
        if (!_activated) {
            setDefaultVoice(defaultVoice);
            speak('ready', 0.0);
            _activated = true;
        }
    }
    
    const isSupported = () => {
        return 'speechSynthesis' in window;
    };

    async function getVoices(lang = null, asOptions = false) {
        const voices = isSupported() ? await synthVoices(lang, asOptions) : [];
        return voices;
    }

    function synthVoices(lang, asOptions) {
        return new Promise(resolve => {
            const synth = window.speechSynthesis;
            const onVoicesChanged = () => {
                synth.removeEventListener('voiceschanged', onVoicesChanged);
                resolve(filterOnLang());
            };
            const filterOnLang = () => {
                let voices = synth.getVoices();
                if (lang)
                    voices = voices.filter(
                        voice => voice.lang.replace('_', '-').substring(0, lang.length) === lang);

                if (asOptions) {
                    voices = voices.map(voice => {
                        return {value: voice.name, label: voice.name};
                    });
                }
                return voices;
            };
            const voices = synth.getVoices();
            voices.length ? resolve(filterOnLang()) : synth.addEventListener('voiceschanged', onVoicesChanged);
        });
    }

    const speak = (text, volume=1.0, rate=1.0, pitch=1.0, voice=null) => {
        if (isSupported()) {
            //const utterance = new SpeechSynthesisUtterance();
            const utterance = getUtterance();
            utterance.text = text;
            utterance.volume = volume;
            utterance.rate = rate;
            utterance.pitch = pitch;
            if (!voice) voice = _defaultVoice;
            if (voice) {
                utterance.voice = voice;
                utterance.lang = voice.lang;
            }
            window.speechSynthesis.speak(utterance);
        }
    }

    const getUtterance = () => {
        if (!_utterance && isSupported()) {
            _utterance = new SpeechSynthesisUtterance();
            _utterance.onerror = onUtteranceError;
        }
        return _utterance;
    }

    const clearPending = () => {
        if (isSupported() && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
            window.speechSynthesis.cancel();
        }
    }

    const onUtteranceError = (event) => {
        console.error(event.error);
    }

    const setDefaultVoice = (voiceName) => {
        if (voiceName) {
            getVoices().then(voices => {
                _defaultVoice = voices.reduce(
                    (p, c) => ('name' in c && c.name === voiceName) ? c : p, null);
            });
        }
    }

    return {
        speak, getVoices, isSupported, activateOnClick, clearPending,
        get utterance() {return getUtterance()},
        get defaultVoice() {return _defaultVoice},
        set defaultVoice(voiceName) {setDefaultVoice(voiceName)},
    }
}

const Voice = _Voice();

export default Voice;