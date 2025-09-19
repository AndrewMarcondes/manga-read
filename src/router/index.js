import { createWebHistory, createRouter } from "vue-router";
import Current from "@/components/Current";
import Finished from "@/components/Finished";
import Wishlist from "@/components/Wishlist";

const routes = [
    {
        path: "/",
        name: "Current",
        component: Current,
    },
    {
        path: "/finished",
        name: "Finished",
        component: Finished,
    },
    {
        path: "/wishlist",
        name: "Wishlist",
        component: Wishlist,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;