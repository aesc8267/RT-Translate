import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    // 将 antd 强制内置到打包流程中，转换成 Node 可识别的格式
    noExternal: ['antd','rc-util','@ant-design/icons','rc-pagination']
  },
  // base: "./",
  server: {
    host:true,
    https:{
      key: "./localhost+3-key.pem",
      cert: "./localhost+3.pem"
    },
    // port:5173,
    proxy: {
      // '/api':{
      //     target: 'http://127.0.0.1:5000',
      //     changeOrigin: true,
      //     // ws: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      // },
      "/v1": {
        target: "https://192.168.31.172:5000",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/v1/, ""),
      },
    },
  },
});
