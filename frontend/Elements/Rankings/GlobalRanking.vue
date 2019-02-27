<template>
    <div>
        <div v-for="user in globalRank" :key="user.id">
            {{user.username}} : {{ Math.abs(user.total)}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "GlobalRanking",
        props: {
            rounds: {
                type: Array,
                required: true
            },
            users: {
                type: Array,
                required: true
            }
        },
        methods: {
            /**
             * Return the score of the given user
             * @param userId The id of the Twitch user
             * @returns {number} The score of the user
             */
            getUserTotalScore(userId) {
                let total = 0;
                this.rounds.forEach((round) => {
                    for (let i = 0; i < round.round.length; i++) {
                        if (userId === round.round[i].id) {
                            total = total + round.round[i].score
                        }
                    }
                });
                return total;
            }
        },
        computed: {
            /**
             * Generate the array to display the users ordered by their scores
             * @returns {Array}
             */
            globalRank() {
                return this.users.map((user) => {
                    return {
                        id: user.twitchId,
                        username: user.username,
                        total: this.getUserTotalScore(user.twitchId)
                    }
                }).sort((a, b) => {
                    return a.total - b.total
                })
            }
        }
    }
</script>

<style scoped>

</style>
