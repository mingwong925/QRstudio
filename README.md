# QR Studio

繁體中文 QR Code 生成器。輸入文字或網址即可即時預覽，調整顏色、輸出尺寸與錯誤修正等級，並下載 SVG、PNG 或 JPG 檔案。

## 開發

```sh
npm run dev
```

在瀏覽器開啟終端機顯示的本機網址。

## 驗證與建置

```sh
npm run lint
npm run build
```

QR Code 透過 `qrcode` 套件在瀏覽器端產生；PNG 與 JPG 也在本機轉檔，文字不會上傳。SVG 可無損放大，PNG 適合透明度需求，JPG 適合一般照片與文件用途。
