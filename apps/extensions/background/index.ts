chrome.omnibox.onInputEntered.addListener((text) => {
  // ex: https://chatgpt.com/?q=hoge&hints=search&ref=ext
  const queryUrl = `https://chatgpt.com/?q=${encodeURIComponent(text)}&hints=search&ref=ext`;
  chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    console.log("tabs", tabs);
    // @ts-expect-error
    await chrome.tabs.update(tabs?.[0]?.id, {url: queryUrl});
  });
});

export {};
