import api from "@/services/api.js";

export default {
    getGames(searchTerm) {
    const params = { search: searchTerm }
    return api.get(`search`, { params })
  },
  getall() {
    return api.get(`getall`)
  },
  postRecommend(payload) {
    return api.post(`recommend/`, payload).then((response) => response.data)
  },
  postResearch(payload) {

    return api.post(`research/`, payload).then((response) => response.data)
  },
    postLook(payload){
        return api.post(`look/`, payload).then((response) =>response.data)
    }
}