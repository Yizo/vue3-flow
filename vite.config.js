/*
 * @Date: 2022-10-25 19:36:56
 * * @LastEditors: LDH 574427343@qq.com
 * @LastEditTime: 2023-03-15 11:20:45
 * @FilePath: /ant-flow/vite.config.js
 */
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  console.log(mode);
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, "src"),
        '~@': path.resolve(__dirname, "src"),
      }
    },
    css: {
      preprocessorOptions: {
          less: {
              modifyVars: {},
              javascriptEnabled: true
          },
          scss: {
              additionalData: `@import "src/styles/global.scss";`
          }
      }
    },
    base: mode === "production" ? '/flow/' : '/',///ant-flow/dist/
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    build: {
  
      /** If you set esmExternals to true, this plugins assumes that 
        all external dependencies are ES modules */
   
      commonjsOptions: {
         esmExternals: true 
      },
   }
  }
})
