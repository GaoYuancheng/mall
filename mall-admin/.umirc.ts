import { defineConfig } from "umi";

const target = "http://localhost:8080";

export default defineConfig({
  routes: [
    { path: "/login", component: "@/pages/login" },
    {
      path: "/",
      component: "@/layouts/BasicLayout",
      routes: [
        { path: "/", redirect: "/dashboard" },
        { path: "/dashboard", component: "@/pages/dashboard" },
        { path: "/user", component: "@/pages/user" },
        { path: "/product", component: "@/pages/product" },
        { path: "/category", component: "@/pages/category" },
        { path: "/order", component: "@/pages/order" },
        { path: "/marketing", component: "@/pages/marketing" },
        { path: "/coupon", component: "@/pages/coupon" },
        { path: "/delivery", component: "@/pages/delivery" },
        { path: "/statistics", component: "@/pages/statistics" },
      ],
    },
  ],
  npmClient: "npm",
  plugins: [
    "@umijs/plugins/dist/antd",
    "@umijs/plugins/dist/request",
    "@umijs/plugins/dist/model",
  ],
  antd: {},
  request: {},
  model: {},
  proxy: {
    // 用户服务
    "/api": {
      target: target,
      changeOrigin: true,
      // pathRewrite: { "^/api/user": "" },
    },
  },
});
