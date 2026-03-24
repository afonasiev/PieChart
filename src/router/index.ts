import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/default.vue";
import HomePage from "@/pages/home/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DefaultLayout,
      children: [{ path: "", component: HomePage }],
    },
    {
      path: "/circle",
      component: DefaultLayout,
      children: [{ path: "", component: () => import("../pages/pie/index.vue") }],
    },
  ],
});

export default router;
