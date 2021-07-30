import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "@/views/About.vue"),
  // },
  {
    path: "/room/:id",
    name: "Room",
    component: () => import(/* webpackChunkName: "about" */ "@/views/Room.vue"),
  },
];

// Always leave this as last one
routes.push({
  path: "/:catchAll(.*)",
  component: Home,
});

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
