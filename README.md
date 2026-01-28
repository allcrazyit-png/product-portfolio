# Product Portfolio Web App

This is a modern, responsive single-page application built with React, Vite, and Tailwind CSS to showcase product data.

## Features
- **Real-time Search:** Instantly filter products by name, ID, or category.
- **Category Filtering:** Quickly switch between different product series.
- **Modern UI:** Glassmorphism design with smooth animations.
- **Responsive:** Optimized for both mobile and desktop.
- **Data Driven:** Product data is loaded from a JSON file (converted from CSV).

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Setup Instructions

1. **Install Dependencies**
   Run the following command in the project root to install the necessary packages:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run Development Server**
   Start the local development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

## 部署指南 (Deploy to GitHub Pages)

本專案可以輕鬆部署到 GitHub Pages。以下提供兩種方式：

### 方法一：使用 `gh-pages` 套件 (推薦)

這是最簡單的方法，只要一個指令就能自動完成。

1. **安裝部署工具**
   在終端機執行：
   ```bash
   npm install gh-pages --save-dev
   ```

2. **設定 `package.json`**
   在 `package.json` 的 `scripts`區塊中新增兩個指令：
   ```json
   "scripts": {
     // ... 其他指令保持不變
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **執行部署**
   每次更新完程式碼後，只需執行：
   ```bash
   npm run deploy
   ```
   程式會自動打包並上傳到 GitHub 的 `gh-pages` 分支。

### 方法二：手動打包上傳

1. **設定路徑**
   開啟 `vite.config.ts`，確保 `base` 設定正確（若為個人首頁用 `/`，專案頁面用 `./` 或 `/專案名稱/`）：
   ```ts
   base: './', 
   ```

2. **建立靜態檔案**
   執行打包指令：
   ```bash
   npm run build
   ```
   成功後會產生一個 `dist` 資料夾。

3. **上傳**
   將 `dist` 資料夾內的「所有內容」上傳到您的主機或 GitHub repository 的 `gh-pages` 分支。

## Project Structure
- `src/components`: React components (ProductCard, ProductModal).
- `src/data`: Contains `products.json` (generated from CSV).
- `public/images`: Product images.
- `public/sop`: PDF documents.
