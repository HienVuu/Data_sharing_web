import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Thêm dòng này

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ép buộc trỏ về đúng thư mục node_modules của client
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
})