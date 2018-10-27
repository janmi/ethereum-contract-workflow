import Vue from 'vue'
import Router from 'vue-router'

const _7c26233a = () => import('../pages/projects/create.vue' /* webpackChunkName: "pages/projects/create" */).then(m => m.default || m)
const _87149994 = () => import('../pages/projects/_address/index.vue' /* webpackChunkName: "pages/projects/_address/index" */).then(m => m.default || m)
const _518828fc = () => import('../pages/projects/_address/payments/create.vue' /* webpackChunkName: "pages/projects/_address/payments/create" */).then(m => m.default || m)
const _8474deca = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)

Vue.use(Router)


if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/projects/create",
			component: _7c26233a,
			name: "projects-create"
		},
		{
			path: "/projects/:address?",
			component: _87149994,
			name: "projects-address"
		},
		{
			path: "/projects/:address?/payments/create",
			component: _518828fc,
			name: "projects-address-payments-create"
		},
		{
			path: "/",
			component: _8474deca,
			name: "index"
		}
    ],
    
    
    fallback: false
  })
}
