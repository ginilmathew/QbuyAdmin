
//export const API_URL = 'https://pal.diginestsolutions.in/public/api';
//export const API_URL = 'https://192.168.1.54/public/api/';

// 1- corporate, 2-ta, 3-customer, 4 -supplier

export const env = "dev"

const URLS = {
    live: "https://api.fast2fastpay.com/",
    dev: "http://18.220.19.226:3010/"
}
const url = {
    dev: "https://apibulletinly.diginestsolutions.in/public/api",
    live: "https://paladmin.dnsappdemo.com/public/api"
    
}

const IMG_URL = {
    dev:'https://apibulletinly.diginestsolutions.in/public'

}

const key = {
    live: "nGw3tbaew9KgjGiXf3JwVnNEDUS4pmsA",
    dev: "nGw3tbaew9KgjGiXf3JwVnNEDUS4pmsA"
}

//'https://apidev.myfutton.com' //Dev mode= http://apidev.myfutton.com //Live Mode='http://api.myfutton.com';
//Dev mode= http://apidev.myfutton.com/api/v1/student //Live Mode=http://api.myfutton.com/api/v1/student';

export const BASE_URL = URLS[env]
export const IMAGE_URL =IMG_URL[env]


export const API_URL = `${url[env]}`
export const API_KEY = `${key[env]}`