import { marked } from 'marked'
import hljs from 'highlight.js'

// 自定义渲染器
const renderer = new marked.Renderer()

// 重写代码块渲染
renderer.code = function({ text: code, lang: language }: { text: string; lang?: string }) {
  const lang = language || 'text'
  
  // 检查是否是mermaid图表
  if (lang === 'mermaid') {
    const id = 'mermaid-' + Math.random().toString(36).substring(2, 9)
    return `<div class="mermaid-container">
      <div class="mermaid" id="${id}">${code}</div>
    </div>`
  }
  
  // 检查是否是echarts图表
  if (lang === 'echarts') {
    const id = 'echarts-' + Math.random().toString(36).substring(2, 9)
    return `<div class="echarts-container">
      <div class="echarts-chart" id="${id}" data-config="${encodeURIComponent(code)}" style="width: 100%; height: 400px;"></div>
    </div>`
  }
  
  // 普通代码块，添加行号和复制功能
  let highlightedCode: string
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlightedCode = hljs.highlight(code, { language: lang }).value
    } catch (err) {
      console.error('Highlight.js error:', err)
      highlightedCode = hljs.highlightAuto(code).value
    }
  } else {
    highlightedCode = hljs.highlightAuto(code).value
  }
  
  const lines = highlightedCode.split('\n')
  const numberedLines = lines.map((line, index) => {
    return `<span class="code-line" data-line="${index + 1}">${line}</span>`
  }).join('\n')
  
  const copyId = 'copy-' + Math.random().toString(36).substring(2, 9)
  
  return `<div class="code-block-container">
    <div class="code-header">
      <span class="code-language">${lang}</span>
    </div>
    <div class="code-content-wrapper">
      <pre class="code-block" data-language="${lang}"><code id="${copyId}" class="hljs language-${lang}">${numberedLines}</code></pre>
      <button class="copy-button" data-copy-id="${copyId}" title="复制代码" aria-label="复制代码">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      </button>
    </div>
  </div>`
}

// 设置自定义渲染器
marked.setOptions({ 
  renderer,
  breaks: true,
  gfm: true,
})

export async function parseMarkdown(content: string): Promise<string> {
  return await marked.parse(content)
}

export function initializeCharts(): string {
  return `
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
      import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.esm.min.js'
      
      // 初始化Mermaid
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#1f2937',
          primaryBorderColor: '#e5e7eb',
          lineColor: '#6b7280',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#ffffff'
        }
      })
      
      // 初始化ECharts
      document.addEventListener('DOMContentLoaded', () => {
        // 渲染所有ECharts图表
        document.querySelectorAll('.echarts-chart').forEach(container => {
          try {
            const configStr = decodeURIComponent(container.dataset.config || '')
            const config = JSON.parse(configStr)
            const chart = echarts.init(container)
            chart.setOption(config)
            
            // 响应式调整
            window.addEventListener('resize', () => {
              chart.resize()
            })
          } catch (error) {
            console.error('ECharts渲染错误:', error)
            container.innerHTML = '<div class="error">图表配置错误</div>'
          }
        })
        
        // 代码复制功能
        document.querySelectorAll('.copy-button').forEach(button => {
          button.addEventListener('click', async () => {
            const copyId = button.dataset.copyId
            const codeElement = document.getElementById(copyId || '')
            if (codeElement) {
              try {
                // 获取纯文本内容（去掉HTML标签和行号）
                const text = codeElement.innerText || codeElement.textContent || ''
                await navigator.clipboard.writeText(text)
                
                // 显示复制成功状态
                const originalHTML = button.innerHTML
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>'
                button.classList.add('copied')
                
                // 2秒后恢复原状
                setTimeout(() => {
                  button.innerHTML = originalHTML
                  button.classList.remove('copied')
                }, 2000)
              } catch (err) {
                console.error('复制失败:', err)
                // 显示复制失败状态
                const originalHTML = button.innerHTML
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>'
                button.classList.add('copy-error')
                
                setTimeout(() => {
                  button.innerHTML = originalHTML
                  button.classList.remove('copy-error')
                }, 1500)
              }
            }
          })
        })
      })
    </script>
  `
}