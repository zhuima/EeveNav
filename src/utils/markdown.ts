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
      <div class="code-actions">
        <button class="copy-button" data-copy-id="${copyId}" title="复制代码" aria-label="复制代码">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="copy-icon">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="success-icon hidden">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon hidden">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="code-content-wrapper">
      <pre class="code-block" data-language="${lang}"><code id="${copyId}" class="hljs language-${lang}">${numberedLines}</code></pre>
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
            const copyIcon = button.querySelector('.copy-icon')
            const successIcon = button.querySelector('.success-icon')
            const errorIcon = button.querySelector('.error-icon')

            if (codeElement && copyIcon && successIcon && errorIcon) {
              try {
                // 获取纯文本内容（去掉HTML标签和行号）
                const lines = codeElement.querySelectorAll('.code-line')
                let text = ''
                lines.forEach(line => {
                  // 获取每行的文本内容，排除行号
                  const lineText = line.textContent || ''
                  // 移除行号部分（通过正则表达式或分割）
                  const cleanText = lineText.replace(/^\s*\d+\s*/, '')
                  text += cleanText + '\n'
                })
                text = text.trim()

                await navigator.clipboard.writeText(text)

                // 显示复制成功状态
                copyIcon.classList.add('hidden')
                successIcon.classList.remove('hidden')
                button.classList.add('copied')

                // 添加成功提示
                showNotification('代码已复制到剪贴板！', 'success')

                // 2秒后恢复原状
                setTimeout(() => {
                  copyIcon.classList.remove('hidden')
                  successIcon.classList.add('hidden')
                  button.classList.remove('copied')
                }, 2000)
              } catch (err) {
                console.error('复制失败:', err)
                // 显示复制失败状态
                copyIcon.classList.add('hidden')
                errorIcon.classList.remove('hidden')
                button.classList.add('copy-error')

                // 添加错误提示
                showNotification('复制失败，请手动选择复制', 'error')

                setTimeout(() => {
                  copyIcon.classList.remove('hidden')
                  errorIcon.classList.add('hidden')
                  button.classList.remove('copy-error')
                }, 1500)
              }
            }
          })
        })

        // 通知函数
        function showNotification(message, type) {
          var notification = document.createElement('div')
          var baseClass = 'fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform translate-x-full '

          if (type === 'success') {
            baseClass += 'bg-green-600 text-white'
          } else if (type === 'error') {
            baseClass += 'bg-red-600 text-white'
          } else {
            baseClass += 'bg-blue-600 text-white'
          }

          notification.className = baseClass
          notification.textContent = message
          notification.style.backdropFilter = 'blur(8px)'

          document.body.appendChild(notification)

          // 动画进入
          setTimeout(function() {
            notification.classList.remove('translate-x-full')
            notification.classList.add('translate-x-0')
          }, 10)

          // 3秒后移除
          setTimeout(function() {
            notification.classList.add('translate-x-full')
            setTimeout(function() {
              notification.remove()
            }, 300)
          }, 3000)
        }
      })
    </script>
  `
}