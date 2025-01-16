import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load the .env file using an absolute path
dotenv.config({ path: resolve(__dirname, '../.env') });
export default defineConfig({
  plugins: [react()],
})
