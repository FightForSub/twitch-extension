<template>
    <div>
        <VideoComponentView v-if="initialized"
                :rounds="rounds"
                :users="users"
                :currentEvent="event"
        ></VideoComponentView>
    </div>
</template>

<script>
    import FFSAPI from '../../../Plugins/FFSAPI/index.js'
    import FFSWebSocket from '../../../Plugins/FFSWebSocket/index.js'
    import VideoComponentView from "../../../Elements/Views/VideoComponentView.vue";

    /**
     * Main component for the video component view in the extension.
     */
    export default {
        name: 'video_component',
        components: {VideoComponentView},
        data() {
            return {
                initialized:false,
                //The jwt token for auth if needed
                jwt: null,
                //users of the event
                users: [],
                //rounds data
                rounds: [],
                //current event
                event:null
            }
        },
        methods: {
            init: function (auth) {
                this.jwt = auth;
            },

            onEventUpdate(data) {
                let round = this.getRound(data.round_id);
                //If the round doesn't exists yet we create it
                if (!round) {
                    this.rounds.push({
                        id: data.round_id,
                        round: []
                    })
                }
                //set the score of the user
                this.updateUserScore(data.round_id, data.user_id, data)

            },
            getRound(roundId) {
                for (let i = 0; i < this.rounds.length; i++) {
                    if (this.rounds[i].id === roundId)
                        return this.rounds[i].round;
                }
            },
            updateUserScore(roundId, userId, data) {
                let round = this.get(roundId);
                let isUserPresent = false;
                for (let i = 0; i < round.length; i++) {
                    if (round[i].id === userId) {
                        isUserPresent = true;
                        round.splice(i, 1, {
                            id: data.user_id,
                            score: data.score
                        })
                    }
                }
                if (!isUserPresent) {
                    round.push({
                        id: data.user_id,
                        score: data.score
                    })
                }
            },
            /**
             * Initialize the connection to the websocket on the FFS server
             * @param eventId the id of the event we want updates from
             */
            connectToFFSSocket(eventId) {
                FFSWebSocket.connect(CONFIG.ebs.socketURl);
                FFSWebSocket.onEventUpdate(this.onEventUpdate);
                FFSWebSocket.onConnected(() => {
                    FFSWebSocket.subscribeToEvent(eventId);
                })
            }
        },
        mounted() {
            // We wait until we got all the data from twitch
            let promises = [];

            //waiting for auth
            promises.push(new Promise((resolve, reject) => {
                window.Twitch.ext.onAuthorized(function (auth) {
                    this.init(auth)
                    resolve({
                        type: "auth",
                        data: auth
                    })
                }.bind(this));
            }))

            promises.push(new Promise((resolve, reject) => {
                window.Twitch.ext.onContext(function (context, contextFields) {
                    //we can now change the style of the extension
                    resolve({
                        type: "context",
                        content: context
                    })
                });
            }))

            promises.push(new Promise((resolve, reject) => {
                window.Twitch.ext.configuration.onChanged(function () {
                    //we can now access the configuration service and get the data from here
                    resolve()
                });
            }))

            Promise.all(promises).then(async (d) => {
                let data = {};

                //Check if there is a current event store in the configuration service and if we set the event Id
                if (window.Twitch.ext.configuration.global
                    && JSON.parse(window.Twitch.ext.configuration.global.content).useConfig
                    && JSON.parse(window.Twitch.ext.configuration.global.content).currentEvent
                    && JSON.parse(window.Twitch.ext.configuration.global.content).currentEvent.id) {
                    return Object.assign(data, {
                        eventId: JSON.parse(window.Twitch.ext.configuration.global.content).currentEvent.id
                    })
                }
                //if not, we fetch it from the API
                else {
                    return Object.assign(data, {
                        event: await FFSAPI.getCurrentEvent()
                    })
                }
            }).then(async (data) => {

                //Check if there is a current event store in the configuration service and if we set the currentRounds
                if (window.Twitch.ext.configuration.global
                    && JSON.parse(window.Twitch.ext.configuration.global.content).useConfig
                    && JSON.parse(window.Twitch.ext.configuration.global.content).currentEvent
                    && JSON.parse(window.Twitch.ext.configuration.global.content).currentEvent.rounds) {
                    return Object.assign(data, {
                        roundsId: JSON.parse(window.Twitch.ext.configuration.global.content).currentEvent.rounds
                    })
                }
                //if not, we fetch the rounds from the API
                else {
                    return Object.assign(data, {
                        roundsId: await FFSAPI.getRoundsfromEvent(data.event.id)
                    })
                }

            }).then(async (data) => {
                //Get the list of the accepted streamers on the event
                let eventId = data.event.id;
                return Object.assign(data, {
                    users: await FFSAPI.getActiveStreamersfromEvent(eventId)
                })
            }).then(async (data) => {
                //Get the data of all the rounds
                let rounds = data.roundsId;
                let eventId = data.event.id;
                return Object.assign(data, {
                    roundsData: await Promise.all(rounds.map(async (roundId) => {
                        return {
                            roundId: roundId,
                            round: await FFSAPI.getRound(eventId, roundId)
                        }
                    }))
                })
            }).then(function (data) {
                //Set up how we get updates
                if (window.Twitch.ext.configuration.global
                    && JSON.parse(window.Twitch.ext.configuration.global.content).useConfig
                    && JSON.parse(window.Twitch.ext.configuration.global.content).useTwitchPubSub){

                    //TODO set up twitch event listeners
                } else {
                    //Get updates from the FFS server
                    this.connectToFFSSocket(data.event.id);
                }


                return data;
            }.bind(this)).then(function (data) {
                //Cleaning scores to be the same format as the update from the pubsub
                this.rounds = data.roundsData.map((round) => {
                    let scores = round.round.map((score) => {
                        return {
                            id: score.id,
                            score: score.score
                        }
                    });
                    return {
                        roundId: round.roundId,
                        round: scores
                    }
                });
                this.users = data.users;
                this.event = data.event;
                this.initialized = true;

            }.bind(this)).catch((err) => {
                //console.error((err))
            })

        }
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800');

    body{
        background-color: #222;
        color:white;
        font-family: 'Open Sans', Helvetica, Arial, sans-serif;
    }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
