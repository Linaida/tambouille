import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import EditRecipeView from '@/views/EditRecipeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/recipes/new',
      name: 'recipe-new',
      component: EditRecipeView,
    },

    {
      path: '/recipes/:id/edit',
      name: 'recipe-edit',
      component: EditRecipeView,
    },

    /*
     * Ancienne URL conservée temporairement.
     */
    {
      path: '/edit',
      redirect: {
        name: 'recipe-new',
      },
    },
  ],
})

export default router
