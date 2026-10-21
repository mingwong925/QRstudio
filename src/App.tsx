import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import './App.css'

type CorrectionLevel = 'L' | 'M' | 'Q' | 'H'
type ExportFormat = 'svg' | 'png' | 'jpg'
type Language = 'zh-Hant' | 'en'

const translations = {
  'zh-Hant': {
    title: 'QR Studio — QR Code SVG 生成器',
    description: '免費線上 QR Code 生成器，即時預覽、自訂顏色與尺寸，下載 SVG、PNG 或 JPG。',
    languageToggle: 'English',
    languageLabel: '切換至英文',
    homeLabel: 'QR Studio 首頁',
    topNote: '免費・免註冊・本機生成',
    heroFirst: '讓每個連結，',
    heroSecond: '都有自己的',
    heroDescription: '簡單幾步，打造你的專屬 QR Code。即時預覽，下載 SVG、PNG 或 JPG 檔案。',
    workspaceLabel: 'QR Code 編輯器',
    contentHeading: '放入你的內容',
    livePreview: '即時預覽',
    contentLabel: '文字或網址',
    placeholder: '輸入網址、文字或任何想分享的內容…',
    clearContent: '清除內容',
    contentHint: '網址、聯絡資訊、活動邀請，任何文字都可以。',
    size: '尺寸',
    sizeHint: '輸出檔案的邊長',
    colors: '顏色',
    colorsHint: '挑選最適合你的風格',
    foreground: '前景',
    background: '背景',
    customForeground: '自訂前景顏色',
    customBackground: '自訂背景顏色',
    correction: '錯誤修正',
    correctionHint: '增加污損或遮蔽時的容錯能力',
    correctionLevels: { L: '低 — 7%', M: '中 — 15%', Q: '較高 — 25%', H: '高 — 30%' },
    previewTitle: '你的 QR Code',
    emptyPreview: '輸入內容以產生',
    ready: '已就緒，隨時可以下載',
    enterContent: '輸入內容後，QR Code 將顯示於此',
    tooLong: '內容太長，請縮短文字或網址後再試一次。',
    exportFailed: '圖片匯出失敗，請再試一次。',
    formatLabel: '選擇下載格式',
    download: (format: string) => `下載 ${format} 檔案`,
    privacy: '你的資料只在此裝置處理，絕不上傳',
  },
  en: {
    title: 'QR Studio — QR Code Generator',
    description: 'Create QR Codes online with live preview, custom colors and size, and SVG, PNG, or JPG downloads.',
    languageToggle: '繁中',
    languageLabel: 'Switch to Traditional Chinese',
    homeLabel: 'QR Studio home',
    topNote: 'Free · No signup · Runs locally',
    heroFirst: 'Give every link',
    heroSecond: ' its own',
    heroDescription: 'Make a QR Code in a few steps. Preview instantly and download it as SVG, PNG, or JPG.',
    workspaceLabel: 'QR Code generator',
    contentHeading: 'Add your content',
    livePreview: 'Live preview',
    contentLabel: 'Text or URL',
    placeholder: 'Enter a URL, text, or anything you want to share…',
    clearContent: 'Clear content',
    contentHint: 'URLs, contact details, event invites, and more.',
    size: 'Size',
    sizeHint: 'Output dimensions',
    colors: 'Colors',
    colorsHint: 'Choose colors for your design',
    foreground: 'Foreground',
    background: 'Background',
    customForeground: 'Customize foreground color',
    customBackground: 'Customize background color',
    correction: 'Error correction',
    correctionHint: 'Helps restore data if the code is damaged or obscured',
    correctionLevels: { L: 'Low — 7%', M: 'Medium — 15%', Q: 'Quartile — 25%', H: 'High — 30%' },
    previewTitle: 'Your QR Code',
    emptyPreview: 'Enter content to generate',
    ready: 'Ready to download',
    enterContent: 'Your QR Code will appear here',
    tooLong: 'Content is too long. Shorten the text or URL and try again.',
    exportFailed: 'Image export failed. Please try again.',
    formatLabel: 'Choose download format',
    download: (format: string) => `Download ${format} file`,
    privacy: 'Your data stays on this device and is never uploaded',
  },
} as const

function SparkleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" /></svg>
}

function DownloadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" /></svg>
}

function App() {
  const [language, setLanguage] = useState<Language>('zh-Hant')
  const copy = translations[language]
  const [content, setContent] = useState('https://example.com')
  const [size, setSize] = useState(320)
  const [foreground, setForeground] = useState('#111827')
  const [background, setBackground] = useState('#ffffff')
  const [correction, setCorrection] = useState<CorrectionLevel>('M')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('svg')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<'' | 'tooLong' | 'exportFailed'>('')

  useEffect(() => {
    document.documentElement.lang = language
    document.title = copy.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.description)
  }, [language, copy])

  useEffect(() => {
    let isCurrent = true

    if (!content.trim()) {
      return () => { isCurrent = false }
    }

    QRCode.toString(content, {
      type: 'svg',
      width: size,
      margin: 2,
      errorCorrectionLevel: correction,
      color: { dark: foreground, light: background },
    }).then((result) => {
      if (isCurrent) {
        setSvg(result)
        setError('')
      }
    }).catch(() => {
      if (isCurrent) {
        setSvg('')
        setError('tooLong')
      }
    })

    return () => { isCurrent = false }
  }, [content, size, foreground, background, correction])

  const downloadFile = (file: Blob, filename: string) => {
    const url = URL.createObjectURL(file)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const downloadQr = async () => {
    if (!svg) return

    if (exportFormat === 'svg') {
      downloadFile(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), 'qrcode.svg')
      return
    }

    const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
    try {
      const image = new Image()
      image.src = svgUrl
      await image.decode()

      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas is unavailable')
      context.fillStyle = background
      context.fillRect(0, 0, size, size)
      context.drawImage(image, 0, 0, size, size)

      const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg'
      const file = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Image export failed')), mimeType, 0.95)
      })
      downloadFile(file, `qrcode.${exportFormat}`)
    } catch {
      setError('exportFailed')
    } finally {
      URL.revokeObjectURL(svgUrl)
    }
  }

  const updateContent = (value: string) => {
    setContent(value)
    if (!value.trim()) {
      setSvg('')
      setError('')
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label={copy.homeLabel}>
          <span className="brand-mark"><span /><span /><span /><span /></span>
          <span>qr<span className="brand-light">studio</span></span>
        </a>
        <div className="top-actions">
          <button className="language-toggle" type="button" onClick={() => setLanguage(language === 'zh-Hant' ? 'en' : 'zh-Hant')} aria-label={copy.languageLabel}>{copy.languageToggle}</button>
          <span className="top-note"><span className="status-dot" />{copy.topNote}</span>
        </div>
      </header>

      <section className="intro" id="top">
        <div className="eyebrow"><SparkleIcon /> SIMPLE QR, BIG IDEAS</div>
        <h1>{copy.heroFirst}<br className="mobile-break" />{copy.heroSecond}<span> QR Code.</span></h1>
        <p>{copy.heroDescription}</p>
      </section>

      <section className="workspace" aria-label={copy.workspaceLabel}>
        <div className="editor-panel">
          <div className="panel-heading">
            <div><span className="step-label">STEP 01</span><h2>{copy.contentHeading}</h2></div>
            <span className="live-badge"><span />{copy.livePreview}</span>
          </div>

          <label className="field-label" htmlFor="qr-content">{copy.contentLabel}</label>
          <div className="input-wrap">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7m2.7 6.4a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" /></svg>
            <input id="qr-content" value={content} onChange={(event) => updateContent(event.target.value)} placeholder={copy.placeholder} />
            {content && <button className="clear-button" type="button" onClick={() => updateContent('')} aria-label={copy.clearContent}>×</button>}
          </div>
          <p className="field-hint">{copy.contentHint}</p>

          <div className="divider" />
          <div className="setting-row">
            <div><label className="field-label" htmlFor="qr-size">{copy.size}</label><p className="field-hint">{copy.sizeHint}</p></div>
            <div className="select-wrap"><select id="qr-size" value={size} onChange={(event) => setSize(Number(event.target.value))}><option value={240}>240 × 240 px</option><option value={320}>320 × 320 px</option><option value={480}>480 × 480 px</option><option value={640}>640 × 640 px</option></select><span>⌄</span></div>
          </div>

          <div className="color-heading"><div><label className="field-label">{copy.colors}</label><p className="field-hint">{copy.colorsHint}</p></div></div>
          <div className="color-controls">
            <label className="custom-color" title={copy.customForeground}><span className="color-chip" style={{ backgroundColor: foreground }} /><span>{copy.foreground}</span><input type="color" value={foreground} onChange={(event) => setForeground(event.target.value)} aria-label={copy.customForeground} /></label>
            <label className="custom-color" title={copy.customBackground}><span className="color-chip" style={{ backgroundColor: background }} /><span>{copy.background}</span><input type="color" value={background} onChange={(event) => setBackground(event.target.value)} aria-label={copy.customBackground} /></label>
          </div>

          <div className="divider lower-divider" />
          <div className="setting-row correction-row">
            <div><label className="field-label" htmlFor="correction">{copy.correction}</label><p className="field-hint">{copy.correctionHint}</p></div>
            <div className="select-wrap"><select id="correction" value={correction} onChange={(event) => setCorrection(event.target.value as CorrectionLevel)}><option value="L">{copy.correctionLevels.L}</option><option value="M">{copy.correctionLevels.M}</option><option value="Q">{copy.correctionLevels.Q}</option><option value="H">{copy.correctionLevels.H}</option></select><span>⌄</span></div>
          </div>
        </div>

        <aside className="preview-panel">
          <div className="preview-title"><span className="step-label">STEP 02</span><span>{copy.previewTitle}</span></div>
          <div className="qr-stage">
            <div className="qr-frame">
              {svg ? <div className="qr-svg" style={{ backgroundColor: background }} dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="qr-empty"><span>QR</span><small>{copy.emptyPreview}</small></div>}
            </div>
            <span className="corner corner-tl" /><span className="corner corner-tr" /><span className="corner corner-bl" /><span className="corner corner-br" />
          </div>
          <p className="preview-caption">{error ? <span className="error-message">{copy[error]}</span> : content.trim() ? copy.ready : copy.enterContent}</p>
          <div className="export-format" role="group" aria-label={copy.formatLabel}>
            {(['svg', 'png', 'jpg'] as const).map((format) => <button key={format} type="button" className={exportFormat === format ? 'active' : ''} aria-pressed={exportFormat === format} onClick={() => setExportFormat(format)}>{format.toUpperCase()}</button>)}
          </div>
          <button className="download-button" onClick={downloadQr} disabled={!svg} type="button"><DownloadIcon />{copy.download(exportFormat.toUpperCase())}</button>
          <p className="privacy-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>{copy.privacy}</p>
        </aside>
      </section>

      <footer className="footer"><span className="copyright">© 2026 Ming Wong</span><span>QR STUDIO <i>✳</i> MADE FOR YOU</span></footer>
    </main>
  )
}

export default App
