import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/login", component: "@/pages/login" },
    {
      path: "/",
      component: "@/layouts/BasicLayout",
      routes: [
        { path: "/", redirect: "/home" },
        { path: "/home", component: "@/pages/home" },
        { path: "/product", component: "@/pages/product" },
        { path: "/product/:id", component: "@/pages/product/detail" },
        { path: "/cart", component: "@/pages/cart" },
        { path: "/order", component: "@/pages/order" },
        { path: "/order/:id", component: "@/pages/order/detail" },
        { path: "/user", component: "@/pages/user" },
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
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
});
