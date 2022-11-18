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