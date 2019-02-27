import axios from 'axios'


const getAuthHeader = function(token){
    return `Bearer ${token}`
};

let twitch = {
    ext: window.Twitch.ext,
    init(jwt) {
        this.token = jwt.token;
    },
    install: function (vue) {
        Object.defineProperty(vue.prototype, '$twitch', {
            get() {
                return twitch
            }
        })

    }
};

export default twitch
