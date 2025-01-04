// // MutationObserverのコールバック関数
// import type { Action } from '@/background'
//
// let observer: MutationObserver | null = null
// function callback(mutationsList: MutationRecord[], _observer: MutationObserver) {
//   for (const mutation of mutationsList) {
//     if (mutation.type === 'childList') {
//       const button = Array.from(document.querySelectorAll('button')).find(
//         (button) => button.textContent === '確認する',
//       )
//       console.log('button', button)
//       if (button) {
//         setTimeout(() => {
//           console.log("🔥 '確認する'ボタンをクリックしました。")
//           button.click()
//         }, 1000) // 1秒後にクリック
//         console.log('指定された要素が現れました:', button)
//         break
//       }
//     }
//   }
// }
//
// // 監視対象のオプション設定
// const config = {
//   childList: true, // 子ノードの変化を監視
//   subtree: true, // 全ての子孫ノードの変化を監視
// }
//
// // 監視を開始する関数
// function waitForElement() {
//   try {
//     if (!observer) {
//       observer = new MutationObserver(callback)
//       observer.observe(document.body, config) // エラーの可能性箇所
//       console.log('監視を開始しました。')
//     } else {
//       console.log('既に監視が開始されています。')
//     }
//   } catch (e) {
//     console.error('MutationObserver の設定中にエラーが発生しました:', e)
//   }
// }
//
// // ページの読み込みが完了したら監視を開始
// if (document.readyState === 'loading') {
//   // document.addEventListener('DOMContentLoaded', waitForElement)
//   document.addEventListener('DOMContentLoaded', waitForElement)
// } else {
//   waitForElement()
// }
//
// // sleep関数
// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }
//
// function onMessage(
//   message: Action,
//   _sender: chrome.runtime.MessageSender,
//   sendResponse: (response: Action) => void,
// ) {
//   if (message.action === 'RETRY') {
//     ;(async () => {
//       const editableDiv: HTMLDivElement | null = document.querySelector(
//         'div[contenteditable="true"].ProseMirror',
//       )
//       if (editableDiv !== null) {
//         editableDiv.innerHTML = '<p>保存してください。</p>'
//         await sleep(1_000)
//         const sendButton: HTMLButtonElement | null = document.querySelector(
//           'button[data-testid="send-button"]',
//         )
//         if (sendButton !== null) {
//           sendButton.click()
//         }
//         editableDiv.innerHTML = ''
//         sendResponse({ action: 'DONE' })
//       } else {
//         console.error('指定した要素が見つかりません。')
//       }
//     })()
//     // async functionを使う場合は、sendResponseを返す必要がある
//     return true
//   }
// }
//
// function removeListeners() {
//   if (chrome.runtime.onMessage.hasListener(onMessage)) {
//     chrome.runtime.onMessage.removeListener(onMessage)
//   }
// }
// function addListeners() {
//   if (!chrome.runtime.onMessage.hasListener(onMessage)) {
//     chrome.runtime.onMessage.addListener(onMessage)
//   }
// }
//
// addListeners()
// window.addEventListener('beforeunload', removeListeners)
