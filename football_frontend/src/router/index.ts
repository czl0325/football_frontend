import { createRouter, createWebHistory, RouterOptions } from 'vue-router'
import { useCacheViewsStore } from "../store/cacheViews.ts"

export const constantRouterMap = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/pages/home/index.vue"),
    meta: {
      num: 0,
      showTab: true
    }
  },
  {
    path: "/match/detail",
    name: "MatchDetail",
    component: () => import("@/pages/detail/index.vue"),
  },
  {
    path: "/reanalyze",
    name: "Reanalyze",
    component: () => import("@/pages/reanalyze/index.vue"),
    meta: {
      num: 1,
      showTab: true
    }
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: () => import("@/pages/feedback/index.vue"),
    meta: {
      num: 2,
      showTab: true
    }
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("@/pages/setting/index.vue"),
    meta: {
      num: 3,
      showTab: true
    }
  }
]

const router = createRouter({
  history: createWebHistory("/"),
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
