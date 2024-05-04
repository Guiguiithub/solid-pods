<template>
  <h2>List of games</h2>
  <div class="d-flex justify-content-between">
    <button type="button" class="btn btn-primary" name="btnDisplay" id="btnLogin" @click="load">Load Games</button>
    <h3 v-if="profile!=null">{{profile}}</h3>
  </div>
  <div class="row justify-content-center">
    <template v-for="result in games">
      <game-comp :result="result" :list-dislike-pods="listOfDislikePods" :list-like-pods="listOfLikePods"/>
    </template>
  </div>
</template>

<script>
  import {fetch} from "@inrupt/solid-client-authn-browser";
  import route from "router/lib/layer.js";
  import GameComp from "@/components/GameComp.vue";
  import {getListLikePods, getListDislikePods} from "@/services/podsPost.js";
  import {getUsername} from "@/services/connection.js";
  import vector from "@/services/vector.js";

  let webIdSaved;
  export default {
    components: {
      GameComp
    },
    data(){
      return {
        games: "",
        listOfLikePods: [],
        listOfDislikePods: [],
        podAddress: localStorage.getItem("myPod"),
        profile: "",
      }
    },
    mounted() {
      webIdSaved = localStorage.getItem("webId")
    },
    methods: {
      async load(){
        this.profile = await getUsername()
        this.listOfLikePods = await getListLikePods(this.podAddress)
        this.listOfDislikePods = await getListDislikePods(this.podAddress)
        await this.loadInitialGames()
      },
      async loadInitialGames() {
        try{
          const response = await vector.getall();
          this.games = response.data.result.splice(0, 100);
        } catch (error){
          console.log(error)
        }
      }
    },
  }
</script>
<style scoped>

</style>
