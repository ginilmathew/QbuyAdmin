
//export const API_URL = 'https://pal.diginestsolutions.in/public/api';
//export const API_URL = 'https://192.168.1.54/public/api/';

// 1- corporate, 2-ta, 3-customer, 4 -supplier

export const env = "live"

const URLS = {
    live: "https://apiqbuygreen.diginestsolutions.in/public/api/",
    testing: "https://qbuygreenapi.diginestsolutions.in/public/api/",
    dev: "https://apiqbuypanda.diginestsolutions.in/public/api/"
}
const url = {
    dev: "https://apibulletinly.diginestsolutions.in/public/api",
    live: "https://apiqbuygreen.diginestsolutions.in/public/api",
    testing: "https://qbuygreenapi.diginestsolutions.in/public/api/",
}

const IMG_URL = {
    live: "https://apiqbuygreen.diginestsolutions.in/public/",
    testing: "https://qbuygreenapi.diginestsolutions.in/public/",
    dev: "https://apiqbuypanda.diginestsolutions.in/public/"
}

const key = {
        live: "nGw3tbaew9KgjGiXf3JwVnNEDUS4pmsA",
        dev: "nGw3tbaew9KgjGiXf3JwVnNEDUS4pmsA",
        testing: "nGw3tbaew9KgjGiXf3JwVnNEDUS4pmsA"
}

//'https://apidev.myfutton.com' //Dev mode= http://apidev.myfutton.com //Live Mode='http://api.myfutton.com';
//Dev mode= http://apidev.myfutton.com/api/v1/student //Live Mode=http://api.myfutton.com/api/v1/student';
export const BASE_URL = URLS[env]
export const IMAGE_URL = IMG_URL[env]
export const API_URL = `${url[env]}`
export const API_KEY = `${key[env]}`