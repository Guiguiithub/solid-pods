<script>
import {addToLikeList, removeLikeList} from "@/services/podsPost.js";
import {addToDislikeList, removeDislikeList} from "@/services/podsPost.js";

export default {
  props: {
    result: {
      type: Object,
      required: true
    },
    listLikePods: {
      type: Object,
      required: true
    },
    listDislikePods:{
      type: Object,
      required: true
    }
  },
  data(){
    return{
      myPodAddress : localStorage.getItem("myPod"),
      isLiked: false,
      isDisliked: false
    }
  },
  mounted() {
    this.isLike(this.result.ident)
    this.isDislike(this.result.ident)
  },
  methods: {
    addDislike(ident, name){
      if (this.isDisliked){
        removeDislikeList(ident, this.myPodAddress)
        this.isDisliked = false
      }
      else {
        addToDislikeList(ident, this.myPodAddress, name)
        this.isDisliked = true
      }
    },
    addLike(ident, name){
      if(this.isLiked){
        removeLikeList(ident, this.myPodAddress)
        this.isLiked = false
      }
      else {
        addToLikeList(ident, this.myPodAddress, name)
        this.isLiked = true
      }
    },
    isLike(ident){
      if(this.listLikePods.find(item => item === this.result.ident)){
        this.isLiked = true
      }
    },
    isDislike(ident){
      if(this.listDislikePods.find(item => item === this.result.ident)){
        this.isDisliked = true
      }
    },
    truncDescription(description){
      description = description.desc
        if(description.length > 200) {
            description = description.substring(0, 200) + '...';
        }
        if(description.substring(0, 16) === "About This Game "){
            description = description.substring(16, description.length)
        }
        if(description.substring(0, 19) === "About This Content "){
            description = description.substring(19, description.length)
        }
        return description
    }
  }
}
</script>

<template>
  <div class="card game-card" style="width: 18rem;">
    <img :src="result.img_url" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">{{ result.name }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ result.price }}</h6>
      <p class="card-text">{{ truncDescription(result.full_desc) }}</p>
      <div class="d-flex justify-content-between">
          <button v-if="!isLiked" class="btn btn-danger" @click="addDislike(result.ident, result.name)" data-name="{{result.ident}}" data-type="like">👎</button>
          <button v-if="!isDisliked" class="btn btn-success" @click="addLike(result.ident, result.name)" data-name="{{result.ident}}" data-type="dislike">👍</button>
      </div>
    </div>
  </div>
</template>

<style>
.game-card{
  margin-left: 10px;
  margin-top: 10px;
}
</style>