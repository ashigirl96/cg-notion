type Role = 'user' | 'admin' | 'moderator' // 必要に応じて他の役割を追加

interface Author {
  role: Role
}

interface Content {
  content_type: 'text' | 'image' | 'video' // 必要に応じて他のタイプを追加
  parts: string[]
}

interface Metadata {
  is_starter_prompt: boolean
  suggestion_type: 'starter' | 'suggestion' | 'other' // 必要に応じて他のタイプを追加
  starter_prompt_id: string | null
}

interface Message {
  id: string
  author: Author
  content: Content
  metadata: Metadata
  create_time: number // Unixタイムスタンプ
}

type Messages = Message[]

export type ChatGPTResponse = {
  messages: Messages
}

const RETRYABLE_PREFIX = ['建築家、', '言葉、']

export function isRetryMessage(messages: Messages) {
  const parts = messages[messages.length - 1].content.parts
  return RETRYABLE_PREFIX.some((prefix) => parts[parts.length - 1].includes(prefix))
}
