import { onRequest as __api_hero_page__page__settings_js_onRequest } from "/home/user/webapp/functions/api/hero/page/[page]/settings.js"
import { onRequest as __api_hero_page__page___id__js_onRequest } from "/home/user/webapp/functions/api/hero/page/[page]/[id].js"
import { onRequest as __api_hero_page__page__js_onRequest } from "/home/user/webapp/functions/api/hero/page/[page].js"
import { onRequestGet as __api_hero_settings_js_onRequestGet } from "/home/user/webapp/functions/api/hero/settings.js"
import { onRequestPost as __api_hero_settings_js_onRequestPost } from "/home/user/webapp/functions/api/hero/settings.js"
import { onRequest as __api_products__id__js_onRequest } from "/home/user/webapp/functions/api/products/[id].js"
import { onRequestOptions as __api_tables___path___js_onRequestOptions } from "/home/user/webapp/functions/api/tables/[[path]].js"
import { onRequest as __api_tables___path___js_onRequest } from "/home/user/webapp/functions/api/tables/[[path]].js"
import { onRequestDelete as __api_hero_js_onRequestDelete } from "/home/user/webapp/functions/api/hero.js"
import { onRequestGet as __api_hero_js_onRequestGet } from "/home/user/webapp/functions/api/hero.js"
import { onRequestPost as __api_hero_js_onRequestPost } from "/home/user/webapp/functions/api/hero.js"
import { onRequestPut as __api_hero_js_onRequestPut } from "/home/user/webapp/functions/api/hero.js"
import { onRequest as __api_products_js_onRequest } from "/home/user/webapp/functions/api/products.js"

export const routes = [
    {
      routePath: "/api/hero/page/:page/settings",
      mountPath: "/api/hero/page/:page",
      method: "",
      middlewares: [],
      modules: [__api_hero_page__page__settings_js_onRequest],
    },
  {
      routePath: "/api/hero/page/:page/:id",
      mountPath: "/api/hero/page/:page",
      method: "",
      middlewares: [],
      modules: [__api_hero_page__page___id__js_onRequest],
    },
  {
      routePath: "/api/hero/page/:page",
      mountPath: "/api/hero/page",
      method: "",
      middlewares: [],
      modules: [__api_hero_page__page__js_onRequest],
    },
  {
      routePath: "/api/hero/settings",
      mountPath: "/api/hero",
      method: "GET",
      middlewares: [],
      modules: [__api_hero_settings_js_onRequestGet],
    },
  {
      routePath: "/api/hero/settings",
      mountPath: "/api/hero",
      method: "POST",
      middlewares: [],
      modules: [__api_hero_settings_js_onRequestPost],
    },
  {
      routePath: "/api/products/:id",
      mountPath: "/api/products",
      method: "",
      middlewares: [],
      modules: [__api_products__id__js_onRequest],
    },
  {
      routePath: "/api/tables/:path*",
      mountPath: "/api/tables",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_tables___path___js_onRequestOptions],
    },
  {
      routePath: "/api/tables/:path*",
      mountPath: "/api/tables",
      method: "",
      middlewares: [],
      modules: [__api_tables___path___js_onRequest],
    },
  {
      routePath: "/api/hero",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_hero_js_onRequestDelete],
    },
  {
      routePath: "/api/hero",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_hero_js_onRequestGet],
    },
  {
      routePath: "/api/hero",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_hero_js_onRequestPost],
    },
  {
      routePath: "/api/hero",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_hero_js_onRequestPut],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_products_js_onRequest],
    },
  ]