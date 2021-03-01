import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ItemInput from "../views/ItemInput.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: ItemInput
  },
  {
    path: "/results",
    name: "Results",
    component: () => import("../views/Results.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
