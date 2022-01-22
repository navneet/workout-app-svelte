'use strict';

async function fetcher(resource, init = {}, response_type = 'json') {
    init = Object.assign({ method: 'GET' }, init);
    const response = await fetch(resource, init);
    if (response.ok) {
        const result = await response[response_type]();
        return result;
    } else {
        throw new Error(response);
    }
}

function loadScript(src, attrbs={}) {
    return new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        tag.src = src;
        tag.onload = event=>resolve(event);
        tag.onerror = event=>reject(event);
        Object.entries(attrbs).map(([k,v]) => tag.setAttribute(k,v));
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
}

function hashString(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

function getURLParams(url) {
    const params = new URLSearchParams();
    if (url && url.lastIndexOf('?') !== -1) {
        let paramstr = url.split('?');
        if (paramstr.length > 1) {
            paramstr = paramstr[1];
            const paramsarr = paramstr.split('&'); // get all key-value items
            paramsarr.forEach(val => {
                const tmparr = val.split('='); // split key from value
                if (tmparr.length == 2)
                    params.append(tmparr[0], tmparr[1]);
            });
        }
    }
    return params;
}

function secsToMinSecs(seconds) {
    seconds = Math.abs(seconds);
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60);
    return { m, s };
}

function secsToClock(seconds) {
    let { m, s } = secsToMinSecs(seconds);
    return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
}

function titleCase(str) {
    return str.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
}

function getUserLangISO639() {
    const usrLang = navigator.language || navigator['userLanguage'];
    return usrLang.split('-')[0];
}

function mapOnKey(list = [], key = '') {
    return list.map(value => value[key]);
}

function pickRandomFromArray(arr = [], num = 1) {
    if (arr.length < num)
        return arr;
    const res = [];
    for (let i = 0; i < num;) {
        const random = Math.floor(Math.random() * arr.length);
        if (res.indexOf(arr[random]) !== -1) continue;
        res.push(arr[random]);
        i++;
    };
    return res;
}

 function getRandomString(length = 6) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

export {
    fetcher, getURLParams, loadScript,
    titleCase, getRandomString, hashString, getUserLangISO639,
    pickRandomFromArray, mapOnKey,
    secsToClock, secsToMinSecs};