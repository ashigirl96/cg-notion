let mutationObserverInstance: MutationObserver | null = null

const MESSAGE = `
Do not hallucinate! Always provide the accuracy rate of your answer! 

`

const isAlreadyArticleExist = () => {
  const article = document.querySelector('article')
  return !!article
}

function addMessage() {
  if (window.location.href.includes('daily')) {
    return false
  }
  if (isAlreadyArticleExist()) {
    return false
  }
  const editableDiv: HTMLDivElement | null = document.querySelector(
    'div[contenteditable="true"].ProseMirror',
  )
  if (editableDiv == null) {
    return false
  }
  const pTag: HTMLParagraphElement | null = editableDiv.querySelector('p')
  if (pTag == null) {
    return false
  }
  if (pTag.textContent?.includes('Do not hallucinate!')) {
    return false
  }
  pTag.innerHTML = `${MESSAGE}<br/><br/>`
  return true
}
/**
 * DOMの変化を監視するためのMutationObserverを設定します。
 * 目的の要素が追加された場合にcheckComposerBackgroundを呼び出します。
 */
const setupMutationObserver = () => {
  if (mutationObserverInstance) {
    mutationObserverInstance.disconnect()
  }

  mutationObserverInstance = new MutationObserver((_mutations, _obs) => {
    addMessage()
    for (const mutation of _mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            const button = node.querySelector('button')
            if (button?.textContent === '確認する') {
              console.log('button', button)
              setTimeout(() => {
                console.log("🔥 '確認する'ボタンをクリックしました。")
                button.click()
              }, 1000) // 1秒後にクリック
            }
          }
        }
      }
    }
  })

  mutationObserverInstance.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
    characterDataOldValue: false,
    attributeOldValue: false,
  })
}

/**
 * 初期化関数。
 * ページの初回読み込み時とURLの変更時にチェックを行います。
 */
const init = () => {
  setupMutationObserver()
}

// DOMが完全に読み込まれたときに初期化を実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true })
} else {
  init()
}
