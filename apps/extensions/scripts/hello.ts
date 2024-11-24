// content_script.js

// 監視したい要素のセレクターを定義
const targetSelector = '#example'; // 例えば、id="example" の要素を待つ場合

// MutationObserverのコールバック関数
function callback(mutationsList:  MutationRecord[], observer: MutationObserver) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const button = Array.from(document.querySelectorAll("button")).find((button) => button.textContent === "確認する");
      console.log("button", button)
      if (button) {
        setTimeout(() => {
          console.log("🔥 '確認する'ボタンをクリックしました。");
          button.click();
        }, 1000); // 1秒後にクリック
        console.log('指定された要素が現れました:', button);
        break;
      }
    }
  }
}

// 監視対象のオプション設定
const config = {
  childList: true, // 子ノードの変化を監視
  subtree: true // 全ての子孫ノードの変化を監視
};

// 監視を開始する関数
function waitForElement() {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, config);
}

// ページの読み込みが完了したら監視を開始
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForElement);
} else {
  waitForElement();
}

export {}