/* global vars */
const API = "https://ams01.pronote.plus/";
const API_VERSION = "v1";
const APP_VERSION = "4.1b.0";

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
    // navigator.serviceWorker.register('sw.js');
};

/* global functions */
function constructAuthURL(authData) {
    return API + "auth?url=" + authData.url + "&username=" + authData.username + "&password=" + authData.password + "&cas=" + authData.cas;
}

/* time management */
function lz(n) {
    return n < 10 ? "0" + n : n;
}

let rn = new Date();
let rnString = rn.getFullYear() + "-" + lz(rn.getMonth() + 1) + "-" + lz(rn.getDate());

/* check if logged in */
let isAuthenticated = false;
if (localStorage.getItem('loginData') !== null) {
    isAuthenticated = true;
}

/* classic fetch */
function fetchPapillon(endpoint, params) {
    // ajoute les paramètres à l'URL
    let baseURL = API + endpoint + "?";
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

function sendQL(schema) {
    return fetchPapillon("query", {
        token: localStorage.getItem('token'),
        schema: schema,
    });
}

/* get basic user data */
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
    
    sendQL(user_request).then((data) => {
        if(data.message == "Unknown session token") {
            refreshToken()
        }

        localStorage.setItem('userData', JSON.stringify(data.data.user));
    });
}

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
        text: "Vous n'êtes plus connecté à internet.",
        className: "notification error",
        gravity: "bottom"
    }).showToast();
});

window.addEventListener('online', (event) => {
    Toastify({
        text: "Vous êtes à nouveau connecté à internet.",
        className: "notification success",
        gravity: "bottom"
    }).showToast();
});

/* auto re-login */
let waitingForToken = false;

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
                gravity: "bottom"
            }).showToast();

            fetch(constructAuthURL(loginData)).then((response) => response.json()).then((data) => {
                if (data.token != undefined) {
                    localStorage.setItem('token', data.token);
                    // broadcast event
                    let event = new CustomEvent('updatedToken', {detail: data.token});
                    document.dispatchEvent(event);
                    waitingForToken = false;
                }
            });
        }
    }
    else {
        console.error("Already waiting for token");
    }
}

// focus
let lastblur = new Date();

document.addEventListener("visibilitychange", (event) => {
    if (document.visibilityState == "visible") {
        // check if last blur was more than 5 minutes ago
        let now = new Date();
        let diff = now - lastblur;
        if(diff > 300000) {
            // pronote has probably expired since then
            refreshToken();
        }
    }
    else {
        lastblur = new Date();
    }
});