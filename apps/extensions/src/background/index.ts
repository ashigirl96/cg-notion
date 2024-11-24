import { type ChatGPTResponse, isRetryMessage } from '@/background/isRetryMessage'

// Tabを管理するためのリスナー
function onInputEntered(text: string) {
  // ex: https://chatgpt.com/?q=hoge&hints=search&ref=ext
  const queryUrl = `https://chatgpt.com/?q=${encodeURIComponent(text)}&hints=search&ref=ext`
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    console.log('tabs', tabs)
    // @ts-expect-error
    await chrome.tabs.update(tabs?.[0]?.id, { url: queryUrl })
  })
}

// ChatGPTのリクエストを監視するリスナー
type TabId = number
type Status = 'pending'
const _registry = new Map<TabId, Status>()
function onBeforeRequest(details: chrome.webRequest.WebRequestDetails) {
  if (details.url === 'https://chatgpt.com/backend-api/conversation') {
    const rawData = details.requestBody.raw[0].bytes
    const decoder = new TextDecoder('utf-8')
    const requestBody: ChatGPTResponse = JSON.parse(decoder.decode(rawData))
    if (isRetryMessage(requestBody.messages)) {
      _registry.set(details.tabId, 'pending')
      console.log('LETS GO!!')
    }
  }
}

export type Action = { action: 'RETRY' } | { action: 'DONE' }
async function onCompleted(details: chrome.webRequest.WebRequestDetails) {
  if (
    _registry.has(details.tabId) &&
    details.url === 'https://chatgpt.com/backend-api/conversation'
  ) {
    const _response = await chrome.tabs.sendMessage(details.tabId, { action: 'RETRY' })
    if (_response.action === 'DONE') {
      console.log('onComplete', details)
      _registry.delete(details.tabId)
    }
    return
  }
}

// chrome.webRequest.onBeforeRequest.addListener()
function addListeners() {
  if (!chrome.omnibox.onInputEntered.hasListener(onInputEntered)) {
    chrome.omnibox.onInputEntered.addListener(onInputEntered)
  }
  if (!chrome.webRequest.onBeforeRequest.hasListener(onBeforeRequest)) {
    chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, { urls: ['<all_urls>'] }, [
      'requestBody',
    ])
  }
  if (!chrome.webRequest.onCompleted.hasListener(onCompleted)) {
    chrome.webRequest.onCompleted.addListener(onCompleted, { urls: ['<all_urls>'] })
  }
}

addListeners()
