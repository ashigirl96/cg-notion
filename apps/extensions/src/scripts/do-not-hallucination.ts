let mutationObserverInstance: MutationObserver | null = null

const MESSAGE = `
Do not hallucinate! Always provide the accuracy rate of your answer! 

`

const isAlreadyArticleExist = () => {
  const article = document.querySelector('article')
  return !!article
}

function addMessage() {
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
    console.log('既にMutationObserverが設定されています。')
    mutationObserverInstance.disconnect()
  } else {
    console.log('まだないよ。MutationObserverを設定します。')
  }

  mutationObserverInstance = new MutationObserver((_mutations, _obs) => {
    if (isAlreadyArticleExist()) {
      return
    }
    addMessage()
  })

  mutationObserverInstance.observe(document.body, {
    childList: true,
    subtree: false,
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
