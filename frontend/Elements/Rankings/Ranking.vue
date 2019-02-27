<template>
    <div>
        <div>
            <div>
                <div class="title">Alive ({{streamersAlive.length}})</div>
                <div class="user-group">
                    <div v-for="streamer in streamersAlive"
                         :key="streamer.id"
                         class="user">
                        <img class="picture" :src="streamer.logo">
                        {{streamer.username}}
                    </div>
                </div>
            </div>
            <div>
                <div class="title">Dead ({{streamersDead.length}})</div>
                <div class="user-group">
                    <div v-for="streamer in streamersDead"
                         :key="streamer.id"
                         class="user">
                        <img class="picture" :src="getStreamerById(streamer.id).logo">
                        {{getStreamerById(streamer.id).username}} / {{Math.abs(streamer.score)}}
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Ranking",
        props: {
            round: {
                type: Array,
                required: true
            },
            users: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                page: 0
            }
        },
        methods: {
            /**
             * Return true if a streamer is not in the round results
             * @param streamer The user object
             * @returns {Boolean}
             */
            isStreamerAlive(streamer) {
                for (let i = 0; i < this.round.length; i++) {
                    //If the streamer is it the round results, he is dead
                    if (this.round[i].id === streamer.twitchId) {
                        return false;
                    }
                }
                return true;
            },
            /**
             * Return the user from the user list, based on its id
             * @param id The twitch id of the streamer we want to find
             * @returns {Object}
             */
            getStreamerById(id) {
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].twitchId === id)
                        return this.users[i]
                }
            }
        },
        computed: {
            /**
             * Return the list of the streamers still alive in the round
             * @returns {Array}
             */
            streamersAlive() {
                return this.users.slice().filter(this.isStreamerAlive)
            },
            /**
             * Return the ordered list of streamer who died in this round, ordered by their score
             * @returns {Array}
             */
            streamersDead() {
                //we return the round score, sorted by score
                return this.round.slice().sort((a, b) => {
                    return a.score - b.score
                });
            },
        },
    }
</script>

<style scoped>


    .title {
        font-weight: bold;
    }

    .user-group {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }

    .user {
        background-color: rgba(158, 158, 158, 0.2);
        padding-right: 10px;
        width: 200px;
        border-radius: 50px;
        color: white;
        display: flex;

        align-items: center;
        margin-right: 20px;
        margin-bottom: 10px;
    }

    .picture {
        display: inline-block;
        height: 30px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>
