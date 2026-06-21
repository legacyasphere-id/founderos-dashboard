import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://founderos-dashboard-bteb30oyv-yoga-pratama-effendi-s-projects.vercel.app',
    headless: true,
  },
})
