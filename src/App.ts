/* global vars */
const API = "https://ams01.pronote.plus/";
const API_VERSION = "v1";

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

/* global functions */
function constructAuthURL(authData) {
    return API + "auth?url=" + authData.url + "&username=" + authData.username + "&password=" + authData.password + "&cas=" + authData.cas;
}

/* time management */
let rn = new Date();
let rnString = rn.getFullYear() + "-" + (rn.getMonth() + 1) + "-" + rn.getDate();

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
        localStorage.setItem('userData', JSON.stringify(data.data.user));
    });
}

/* colors (stolen from https://gist.github.com/Ademking/560d541e87043bfff0eb8470d3ef4894) */
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
}

const baseColors = [
    {
      "hex": "#898989",
      "name": "Grey",
    },
    {
      "hex": "#E1006C",
      "name": "Pink",
    },
    {
      "hex": "#0FBA9B",
      "name": "Lime",
    },
    {
      "hex": "#F13232",
      "name": "Red",
    },
    {
      "hex": "#A725C8",
      "name": "Purple",
    },
    {
      "hex": "#00B562",
      "name": "Green",
    },
    {
      "hex": "#C84325",
      "name": "Orange",
    },
    {
      "hex": "#C87325",
      "name": "Mustard",
    },
    {
      "hex": "#9747FF",
      "name": "Indigo",
    },
    {
      "hex": "#1A8DCE",
      "name": "Blue",
    },
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