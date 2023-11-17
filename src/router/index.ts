import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import { useCacheViewsStore } from "../store/cacheViews.ts"

export const constantRouterMap = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home/index.vue"),
  },
  {
    path: "/detail",
    name: "MatchDetail",
    component: () => import("@/pages/detail/index.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap,
  // @ts-ignore
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        resolve(savedPosition)
      } else {
        setTimeout(() => {
          resolve({
            left: 0,
            top: 0
          })
        }, 0)
      }
    })
  }
} as RouterOptions)

// @ts-ignore
router.beforeEach(async (to, from, next)   => {
  if (from.name) {
    const fp = from.path.split('/').filter(function (n: string) {
      return n && n.trim()
    })
    const tp = to.path.split('/').filter(function (n: string) {
      return n && n.trim()
    })
    const store = useCacheViewsStore()
    if (tp.length >= fp.length) {
      store.addCachedView(from.name.toString())
    } else {
      store.removeCachedView(from.name.toString())
    }
  }
  next()
})

export default router
