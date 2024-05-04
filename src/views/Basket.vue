<script>
import GameComp from "@/components/GameComp.vue";
import {getUsername} from "@/services/connection.js";
import {getListLikePods, getListDislikePods} from "@/services/podsPost.js";
import vector from "@/services/vector.js";
export default {
  components: {
    GameComp
  },
  data(){
    return {
      listOfLikeGames: [],
      listLikeIds: [],
      listOfDislikeGames: [],
      listOfDislikeIds: [],
      podAddress: localStorage.getItem("myPod"),
      profile: "",
      webIdSaved: ""
    }
  },
  mounted() {
    this.webIdSaved = localStorage.getItem("webId")
    },
  methods: {
    async load(){
      this.profile = await getUsername()
      this.listLikeIds = await getListLikePods(this.podAddress)
      this.listOfDislikeIds = await getListDislikePods(this.podAddress)
      await this.loadGames()
    },
    async loadGames(){
      for (let i=0; i< this.listLikeIds.length; i++){
        try{
          const response = await vector.postLook(this.listLikeIds[i])
          this.listOfLikeGames.push(response.data.result)
        }catch (error){
          alert('error occur during lookup for like games');
          console.log(error)
        }
      }
      for (let i = 0; i<this.listOfDislikeIds.length; i++){
        try{
          const response = await vector.postLook(this.listLikeIds[i])
          this.listOfDislikeGames.push(response.data.result)
        } catch (error){
          alert('error occur during lookup for dislike games');
          console.log(error)
        }

      }
    }
  }
}
</script>

<template>
  <h1>Basket</h1>
  <button type="button" class="btn btn-primary" name="btnDisplay" id="btnLogin" @click="load">Load Games</button>
  <h3>List of like Items</h3>
  <template v-for="result in listOfLikeGames">
    <game-comp :result="result" :list-dislike-pods="listOfDislikeIds" :list-like-pods="listLikeIds"/>
  </template>
  <h4>List of dislike Items</h4>
  <template v-for="result in listOfDislikeGames">
    <game-comp :result="result" :list-dislike-pods="listOfDislikeIds" :list-like-pods="listLikeIds"/>
  </template>

</template>
