import {createRouter, createWebHistory} from "vue-router"

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/HomePage.vue")
    },
    {
        path: "/recommendation",
        name: "Recommendation",
        component: () => import("../views/Recommendation.vue")
    },
    {
        path: "/basket",
        name: "Basket",
        component: () => import("../views/Basket.vue")
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router