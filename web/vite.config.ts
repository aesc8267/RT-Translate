import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      // '/api':{
      //     target: 'http://127.0.0.1:5000',
      //     changeOrigin: true,
      //     // ws: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      // },
      "/v1": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/v1/, ""),
      },
      "/socket.io": {
        target: "https://dashscope.aliyuncs.com",
        changeOrigin: true,
        secure: false, // 如果目标服务器使用 HTTPS，但证书无效，可以设为 false
        ws: true, // 允许 WebSocket 代理
        
      },
    },
  },
});
