<template>
    <div>
        <div class="container"  v-if="rounds[0]">
            <div class="header">{{currentEvent.name}}</div>
            <div class="menu">
                <div class="button"
                @click="setRound(0)"
                >All</div>
                <div class="button" v-for="(round,index) in rounds"
                     @click="setRound(index+1)"
                     :key="index">{{index+1}}</div>
            </div>
            <template v-if="clickedRound===0">
                <GlobalRanking
                :users="users"
                :rounds="rounds"
                ></GlobalRanking>
            </template>
            <template v-else>
                <Ranking v-if="rounds[clickedRound-1].round.length"
                         :users="users"
                         :round="rounds[clickedRound-1].round"
                ></Ranking>
            </template>

        </div>
    </div>
</template>

<script>
    import Ranking from "../Rankings/Ranking.vue";
    import GlobalRanking from "../Rankings/GlobalRanking.vue";
    export default {
        name: "VideoComponentView",
        components: {GlobalRanking, Ranking},
        props:{
            rounds:{
                required:true,
                type:Array
            },
            users:{
                required:true,
                type:Array
            },
            currentEvent:{
                type:Object,
                required:true
            }
        },
        data(){
            return{
                clickedRound:0
            }
        },
        methods:{
            setRound(rank){
                this.clickedRound=rank;
            }
        }
    }
</script>

<style scoped>
    .container{
    }

    .menu{
        display: flex;
    }
    .menu .button{
        border: gray solid 1px;
        background-color: black;
        color: white;
        font-weight: bold;
        cursor: pointer;
        padding: 4px;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
