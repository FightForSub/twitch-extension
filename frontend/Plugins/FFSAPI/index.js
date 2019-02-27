import axios from 'axios'

const API_ENDPOINT = "https://api-ffs.zerator.com/v1/";

const generateHeaders = function(){
    return{
        "Content-Type": "application/json",
    }
}


//TODO improve error handling
const sendGetRequest= function(url,options){
    return axios.get(url, options)
        .then(response => {
            // If request is good...
            return response.data;
        })
}

let FFSAPI = {

    async getCurrentEvent() {
        const path = `event/current`;
        const URL = API_ENDPOINT+path;

        const options = {
            headers: generateHeaders()
        };

        return await sendGetRequest(URL,options)

    },
    async getEvents() {
        const path = `events`;
        const URL = API_ENDPOINT+path;


        const options = {
            headers: generateHeaders()
        };

        return await sendGetRequest(URL,options)

    },
    async getEvent(eventId) {
        const path = `event/${eventId}`;
        const URL = API_ENDPOINT+path;

        const options = {
            headers: generateHeaders()
        };


        return await sendGetRequest(URL,options)
    },
    async getActiveStreamersfromEvent(eventId) {
        const path = `event/${eventId}/users?status=VALIDATED`;
        const URL = API_ENDPOINT+path;

        const options = {
            headers: generateHeaders()
        };

        return await sendGetRequest(URL,options)
    },
    async getRoundsfromEvent(eventId) {
        const path = `event/${eventId}/rounds`;
        const URL = API_ENDPOINT+path;

        const options = {
            headers: generateHeaders()
        };


        return await sendGetRequest(URL,options)
    },
    async getRound(eventId,roundId) {
        const path = `event/${eventId}/round/${roundId}`;
        const URL = API_ENDPOINT+path;

        const options = {
            headers: generateHeaders()
        };

        return await sendGetRequest(URL,options)
    },
    install: function (vue) {
        Object.defineProperty(vue.prototype, '$ffsApi', {
            get() {
                return FFSAPI
            }
        })

    }
};

export default FFSAPI
