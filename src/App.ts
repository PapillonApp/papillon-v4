/* global vars */
const API = "https://api.pronote.plus";
const API_VERSION = "v2";
const APP_VERSION = "4.1b.1";

let waitingForToken = false;

/* error handling */
const API_LOGIN_ERRORS = {
    "Missing 'url', or 'username', or 'password', or header 'Content-Type: application/json'": {
        "code": 1,
        "message": "Veuillez remplir tous les champs."
    },
    "Wrong user credentials": {
        "code": 2,
        "message": "Identifiants incorrects."
    },
}

/* sw */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
};

/* global functions */
function constructAuthURL(authData) {
    return API + "/auth?url=" + authData.url + "&username=" + authData.username + "&password=" + authData.password + "&cas=" + authData.cas;
}

/* time management */
function lz(n) {
    return n < 10 ? "0" + n : n;
}

let rn = new Date();
let rnString = rn.getFullYear() + "-" + lz(rn.getMonth() + 1) + "-" + lz(rn.getDate());

/* next date */
document.addEventListener('nextDate', function() {
    rn.setDate(rn.getDate() + 1);
    rnString = rn.getFullYear() + "-" + lz(rn.getMonth() + 1) + "-" + lz(rn.getDate());
    document.dispatchEvent(new CustomEvent('rnChanged'));
});

/* previous date */
document.addEventListener('prevDate', function() {
    rn.setDate(rn.getDate() - 1);
    rnString = rn.getFullYear() + "-" + lz(rn.getMonth() + 1) + "-" + lz(rn.getDate());
    document.dispatchEvent(new CustomEvent('rnChanged'));
});


/* check if logged in */
let isAuthenticated = false;
if (localStorage.getItem('loginData') !== null) {
    isAuthenticated = true;
}

/* dev */
function logChange(event) {
    console.warn("%c" + event, `
        color: #00B562;
        font-weight: 600;
    `);
}

function logError(event) {
    console.error("%c" + event, `
        color: #00B562;
        font-weight: 600;
    `);
}

/* classic fetch */
function fetchPapillon(endpoint, params) {
    // ajoute les paramètres à l'URL
    let baseURL = API + "/" + endpoint + "?";
    for (let key in params) {
        baseURL += "&" + key + "=" + params[key];
    }

    // envoie la requête et retourne la réponse
    return fetch(baseURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => response.json());
}

/* send GraphQL query */
function sendQL(schema) {
    let url = API + "/graphql?query=" + schema + "&token=" + localStorage.getItem('token');

    return fetch(url)
        .then((response) => response.json())
        .then((response) => {
            if(response.errors != undefined) {
                if(response.errors[0] = 
                    "Unexpected error value: { code: 5, message: \"Session has expired due to inactivity or error\" }") {
                        refreshToken();
                        return [];
                    }
            }

            if(response.message != undefined) {
                if(response.message = "Unknown session token") {
                    refreshToken();
                    return [];
                }
            }

            return response;
        })
}

/* empty service worker cache */
function emptyCache(automatic) {
    caches.keys().then(function(names) {
        for (let name of names)
            caches.delete(name);
    });
    if(!automatic) {
        Toastify({
            text: "Le cache va être vidé.",
            className: "notification",
            gravity: "bottom",
            position: "center",
        }).showToast();
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
}

/* get basic user data */
function getData() {
    if(isAuthenticated) {
        let user_request = `{
            user {
                name,
                avatar,
                studentClass {
                    name
                },
                establishment {
                    name
                }
            }
        }`;
        
        // envoie la requête et retourne la réponse
        sendQL(user_request).then((response) => {
            console.log(response);
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            document.dispatchEvent(new CustomEvent('userDataUpdated'));
        });
    }
}

getData();

document.addEventListener('updatedToken', () => {
    getData()
})

/* colors (stolen from https://gist.github.com/Ademking/560d541e87043bfff0eb8470d3ef4894) */
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

const baseColors = [
    {"hex": "#898989","name": "Grey",},
    {"hex": "#E1006C","name": "Pink",},
    {"hex": "#0FBA9B","name": "Lime",},
    {"hex": "#F13232","name": "Red",},
    {"hex": "#A725C8","name": "Purple",},
    {"hex": "#00B562","name": "Green",},
    {"hex": "#C84325","name": "Orange",},
    {"hex": "#C87325","name": "Mustard",},
    {"hex": "#9747FF","name": "Indigo",},
    {"hex": "#1A8DCE","name": "Blue",},
    {"hex": "#C567FF","name": "Purple",},
    {"hex": "#4791FF","name": "Blue",},
    {"hex": "#FF6A3A","name": "Orange",},
    {"hex": "#FFB629","name": "Mustard",},
    {"hex": "#30B800","name": "Green",},
    {"hex": "#F422AD","name": "Pink",},
    {"hex": "#AF5757","name": "Red",},
    {"hex": "#8CBC4F","name": "Lime",}
]

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
// Distance between 2 colors (in RGB)
// https://stackoverflow.com/questions/23990802/find-nearest-color-from-a-colors-list
function distance(a, b) {
      return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
}
  
// return nearest color from array
function nearestColor(colorHex){
    var lowest = Number.POSITIVE_INFINITY;
    var tmp;
    let index = 0;
    baseColors.forEach( (el, i) => {
        tmp = distance(hexToRgb(colorHex), hexToRgb(el.hex))
        if (tmp < lowest) {
          lowest = tmp;
          index = i;
        };
        
    })
    return baseColors[index];
}

// online check
window.addEventListener('offline', (event) => {
    Toastify({
        text: "Vous n'êtes plus connecté à Internet.",
        className: "notification error",
        gravity: "bottom",
        position: "center",
    }).showToast();
});

window.addEventListener('online', (event) => {
    Toastify({
        text: "Vous êtes à nouveau connecté à Internet.",
        className: "notification success",
        gravity: "bottom",
        position: "center",
    }).showToast();
});

/* auto re-login */
function refreshToken() {
    if(!waitingForToken) {
        waitingForToken = true;
        if(localStorage.getItem('loginData') != null) {
            // get saved credentials
            let loginData = JSON.parse(localStorage.getItem('loginData'))
            
            // auto login
            Toastify({
                text: "Reconnexion à Pronote en cours...",
                className: "notification",
                gravity: "bottom",
                position: "center",
            }).showToast();

            // send POST to API/auth/login
            fetch(API + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: loginData.username,
                    password: loginData.password,
                    url: loginData.url,
                    cas: loginData.cas,
                }),
            }).then((response) => response.json()).then((data) => {
                if (data.token != undefined) {
                    localStorage.setItem('token', data.token);
                    // broadcast event
                    let event = new CustomEvent('updatedToken', {detail: data.token});
                    document.dispatchEvent(event);
                    waitingForToken = false;

                    Toastify({
                        text: "La reconnextion à Pronote a réussi.",
                        className: "notification success",
                        gravity: "bottom",
                        position: "center",
                    }).showToast();
                }
                else {
                    Toastify({
                        text: "La reconnextion a échoué. Veuillez réessayer ultérieurement.",
                        className: "notification error",
                        gravity: "bottom",
                        position: "center",
                    }).showToast();
                }
            });
        }
    }
    else {
        console.error("Already waiting for token");
    }
}