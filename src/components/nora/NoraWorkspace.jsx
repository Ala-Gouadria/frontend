import { useEffect, useMemo, useRef, useState } from 'react'
import './NoraWorkspace.css'
import NoraAvatar from './NoraChatAvatar'
import noraComponentLogo from '../../assets/logo/Nora_Componennts_Logo.png'
import imageIcon from '../../assets/icons/Nora-AI-Icon/image-add-icon.svg'
import attachmentIcon from '../../assets/icons/Nora-AI-Icon/attachment-icon.svg'
import micIcon from '../../assets/icons/Nora-AI-Icon/mic-icon.svg'
import sentIcon from '../../assets/icons/Nora-AI-Icon/sent-icon.svg'
import { noraWorkspaceApi } from '../../api/noraWorkspaceApi'
import ProjectList from '../layout/ProjectList'
const WELCOME_HEADLINE = 'An AI system that manages, automates, and grows your business.'
const WELCOME_TEXT = 'Welcome back. I can help you grow, automate, and organize your business.'

function formatClock(value) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatHistoryTime(value) {
  const timestamp = new Date(value).getTime()
  const deltaMinutes = Math.max(1, Math.round((Date.now() - timestamp) / (1000 * 60)))

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m`
  }

  const deltaHours = Math.round(deltaMinutes / 60)
  if (deltaHours < 24) {
    return `${deltaHours}h`
  }

  const deltaDays = Math.round(deltaHours / 24)
  return `${deltaDays}d`
}

function formatRecordingDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function deriveConversationTitle(text, fallbackLabel) {
  const cleaned = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (!cleaned) {
    return fallbackLabel
  }

  return cleaned.length > 42 ? `${cleaned.slice(0, 39).trimEnd()}...` : cleaned
}

function AttachmentPreview({ attachment, compact = false }) {
  if (attachment.type === 'image') {
    return (
      <div className={`nora-attachment-card ${compact ? 'nora-attachment-card--compact' : ''}`}>
        <img src={attachment.url} alt={attachment.name} className="nora-attachment-card__image" />
        <div className="nora-attachment-card__meta">
          <strong>{attachment.name}</strong>
          <span>{attachment.sizeLabel}</span>
        </div>
      </div>
    )
  }

  if (attachment.type === 'audio') {
    return (
      <div className={`nora-attachment-card ${compact ? 'nora-attachment-card--compact' : ''}`}>
        <div className="nora-attachment-card__meta">
          <strong>{attachment.name}</strong>
          <span>
            {attachment.durationSeconds ? `${formatRecordingDuration(attachment.durationSeconds)} audio` : 'Voice note'}
          </span>
        </div>
        <audio controls src={attachment.url} className="nora-attachment-card__audio" />
      </div>
    )
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      className={`nora-attachment-card nora-attachment-card--file ${compact ? 'nora-attachment-card--compact' : ''}`}
    >
      <div className="nora-attachment-card__meta">
        <strong>{attachment.name}</strong>
        <span>{attachment.sizeLabel}</span>
      </div>
    </a>
  )
}

function MessageBubble({ message }) {
  const lines = String(message.text ?? '').split('\n').filter(Boolean)

  return (
    <div className={`nora-chat-row nora-chat-row--${message.role}`}>
      <div className={`nora-message-bubble ${message.role}`}>
        {message.serviceLabel ? (
          <span className="nora-inline-service-tag">{message.serviceLabel}</span>
        ) : null}

        {message.isLoading ? (
          <div className="nora-typing-indicator" aria-label="Nora is typing">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <>
            {lines.map((line, index) => (
              <p key={`${message.id}-${index}`} className="nora-message-line">
                {line}
              </p>
            ))}

            {message.attachments?.length ? (
              <div className="nora-attachments-grid">
                {message.attachments.map((attachment) => (
                  <AttachmentPreview key={attachment.id} attachment={attachment} compact />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <span className="nora-message-time">{formatClock(message.createdAt)}</span>
    </div>
  )
}

function HistorySidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNewChat,
  showAll,
  onToggleShowAll,
}) {
  const visibleItems = showAll ? conversations : conversations.slice(0, 7)

  return (
    <aside className="nora-history-sidebar">
      <div className="nora-sidebar-glow" />
      <div className="nora-sidebar-title">History</div>

      <button type="button" onClick={onNewChat} className={`nora-new-chat-btn ${activeConversationId ? '' : 'active'}`}>
        <div className="nora-new-chat-icon">
          <img src={noraComponentLogo} alt="Nora" style={{ width: 18, height: 18, objectFit: 'contain' }} />
        </div>
        <span>New Chat</span>
      </button>

      <div className="nora-recents-title">Recents</div>

      <div className="nora-history-list">
        {visibleItems.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`nora-history-item ${activeConversationId === conversation.id ? 'active' : ''}`}
          >
            <div className="nora-history-item__content">
              <span className="nora-history-item-text">{conversation.title}</span>
              <span className="nora-history-item-preview">{conversation.preview}</span>
            </div>
            <span className="nora-history-item-time">{formatHistoryTime(conversation.updatedAt)}</span>
          </button>
        ))}
      </div>

      {conversations.length > 7 ? (
        <button type="button" className="nora-view-all-btn" onClick={onToggleShowAll}>
          {showAll ? 'Show less' : 'View all'}
        </button>
      ) : null}
    </aside>
  )
}

function ServicePicker({ services, activeServiceId, onSelect }) {
  return (
    <div className="nora-service-picker">
      {services.map((service) => (
        <button
          key={service.id}
          type="button"
          className={`nora-service-chip ${activeServiceId === service.id ? 'nora-service-chip--active' : ''}`}
          onClick={() => onSelect(service.id)}
        >
          {service.shortLabel}
        </button>
      ))}
    </div>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.2 14.8 5 11.3 12.5 3.8c.8-.8 2-.8 2.8 0l.9.9c.8.8.8 2 0 2.8l-7.5 7.5-3.5.8Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11.4 4.9 3.7 3.7" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon({ expanded = false }) {
  if (expanded) {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M7.2 3.4H3.4v3.8M3.4 3.4l5.1 5.1M12.8 16.6h3.8v-3.8M16.6 16.6l-5.1-5.1" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Composer({
  draft,
  onDraftChange,
  onSend,
  pendingAttachments,
  onRemoveAttachment,
  onUpload,
  onToggleRecording,
  isRecording,
  recordingSeconds,
  isSending,
}) {
  const imageInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const audioInputRef = useRef(null)

  const triggerUpload = (ref) => {
    ref.current?.click()
  }

  const forwardFiles = (event, kind) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length) {
      onUpload(kind, files)
    }
    event.target.value = ''
  }

  return (
    <div className="nora-composer">
      <div className="nora-composer-container">
        {pendingAttachments.length ? (
          <div className="nora-files-list">
            {pendingAttachments.map((attachment) => (
              <div key={attachment.id} className="nora-file-chip">
                <span className={`nora-file-chip__type nora-file-chip__type--${attachment.type}`} />
                <span>{attachment.name}</span>
                <button type="button" className="nora-file-remove" onClick={() => onRemoveAttachment(attachment.id)}>
                  x
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {isRecording ? (
          <div className="nora-recording-badge">
            <span className="nora-recording-dot" />
            Recording voice note {formatRecordingDuration(recordingSeconds)}
          </div>
        ) : null}

        <textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              onSend()
            }
          }}
          placeholder="Ask Nora about your business"
          rows={2}
          className="nora-textarea"
        />

        <div className="nora-composer-actions">
          <div className="nora-composer-left-actions">
            <button type="button" className="nora-icon-btn" onClick={() => triggerUpload(imageInputRef)} aria-label="Upload image">
              <img src={imageIcon} alt="" aria-hidden="true" className="nora-composer-icon" />
            </button>

            <button type="button" className="nora-icon-btn" onClick={() => triggerUpload(fileInputRef)} aria-label="Upload file">
              <img src={attachmentIcon} alt="" aria-hidden="true" className="nora-composer-icon" />
            </button>
          </div>

          <div className="nora-composer-right-actions">
            <button
              type="button"
              onClick={onToggleRecording}
              className={`nora-icon-btn light ${isRecording ? 'nora-icon-btn--recording' : ''}`}
              aria-label={isRecording ? 'Stop recording' : 'Record voice note'}
            >
              <img src={micIcon} alt="" aria-hidden="true" className="nora-composer-icon nora-composer-icon--dark" />
            </button>

            <button
              type="button"
              onClick={() => onSend()}
              className="nora-icon-btn light"
              aria-label="Send message"
              disabled={isSending}
            >
              <img src={sentIcon} alt="" aria-hidden="true" className="nora-composer-icon nora-composer-icon--dark" />
            </button>
          </div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => forwardFiles(event, 'image')}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.ppt,.pptx"
          multiple
          hidden
          onChange={(event) => forwardFiles(event, 'file')}
        />
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          multiple
          hidden
          onChange={(event) => forwardFiles(event, 'audio')}
        />
      </div>
    </div>
  )
}

export default function NoraWorkspace({ open, onClose, onNavigate, pairedWithTask = false, fullMode = false }) {
  const [services, setServices] = useState([])
  const [conversationList, setConversationList] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [activeConversation, setActiveConversation] = useState(null)
  const [selectedServiceId, setSelectedServiceId] = useState('general')
  const [draft, setDraft] = useState('')
  const [pendingAttachments, setPendingAttachments] = useState([])
  const [isInitializing, setIsInitializing] = useState(false)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const recordingTimerRef = useRef(null)
  const conversationEndRef = useRef(null)

  const activeService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0] ?? null,
    [selectedServiceId, services],
  )

  const currentMessages = useMemo(() => activeConversation?.messages ?? [], [activeConversation])
  const showConversation = currentMessages.length > 0

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
  }

  const stopRecordingStream = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }

  const upsertConversationSummary = (summary) => {
    setConversationList((current) => {
      const next = current.filter((item) => item.id !== summary.id)
      next.unshift(summary)
      next.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
      return next
    })
  }

  const loadConversation = async (conversationId) => {
    setIsLoadingConversation(true)
    setNotice('')

    try {
      const conversation = await noraWorkspaceApi.getConversation(conversationId)
      setActiveConversationId(conversation.id)
      setActiveConversation(conversation)
      setSelectedServiceId(conversation.serviceId)
      setPendingAttachments([])
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to load this conversation right now.')
    } finally {
      setIsLoadingConversation(false)
    }
  }

  useEffect(() => {
    if (!open) {
      return undefined
    }

    let active = true

    const loadWorkspace = async () => {
      setIsInitializing(true)

      try {
        const [nextServices, nextConversations] = await Promise.all([
          noraWorkspaceApi.listServices(),
          noraWorkspaceApi.listConversations(),
        ])

        if (!active) {
          return
        }

        setServices(nextServices)
        setConversationList(nextConversations)

        if ((pairedWithTask || fullMode) && nextConversations.length > 0) {
          const conversation = await noraWorkspaceApi.getConversation(nextConversations[0].id)
          if (!active) {
            return
          }

          setActiveConversationId(conversation.id)
          setActiveConversation(conversation)
          setSelectedServiceId(conversation.serviceId)
        } else {
          setActiveConversationId(null)
          setActiveConversation(null)
          setSelectedServiceId(nextServices[0]?.id ?? 'general')
        }
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Unable to initialize Nora right now.')
        }
      } finally {
        if (active) {
          setIsInitializing(false)
        }
      }
    }

    void loadWorkspace()

    return () => {
      active = false
    }
  }, [open, pairedWithTask, fullMode])

  useEffect(() => {
    if (!open) {
      return
    }

    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [currentMessages, isSending, open])

  useEffect(() => {
    return () => {
      stopRecordingTimer()
      stopRecordingStream()
    }
  }, [])

  const handleNewChat = () => {
    setActiveConversationId(null)
    setActiveConversation(null)
    setDraft('')
    setPendingAttachments([])
    setNotice('')
  }

  const handleUpload = async (kind, files) => {
    try {
      const uploaded = await Promise.all(
        files.map((file) => noraWorkspaceApi.uploadAttachment(file, kind)),
      )

      setPendingAttachments((current) => [...current, ...uploaded])
      setNotice(`${uploaded.length} ${kind === 'image' ? 'image' : kind === 'audio' ? 'voice file' : 'file'}${uploaded.length > 1 ? 's' : ''} ready to send.`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Upload failed.')
    }
  }

  const handleRemoveAttachment = (attachmentId) => {
    setPendingAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId))
  }

  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      stopRecordingTimer()
      return
    }

    const mediaDevices = globalThis.navigator?.mediaDevices
    const Recorder = globalThis.MediaRecorder

    if (!mediaDevices?.getUserMedia || !Recorder) {
      setNotice('Voice recording is not supported in this browser.')
      return
    }

    try {
      const stream = await mediaDevices.getUserMedia({ audio: true })
      const recorder = new Recorder(stream)
      const chunks = []
      const startedAt = Date.now()

      mediaStreamRef.current = stream
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = async () => {
        stopRecordingStream()
        stopRecordingTimer()

        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))

        try {
          const attachment = await noraWorkspaceApi.uploadVoiceNote(blob, { durationSeconds })
          setPendingAttachments((current) => [...current, attachment])
          setNotice('Voice note attached to the message.')
        } catch (error) {
          setNotice(error instanceof Error ? error.message : 'Voice upload failed.')
        }
      }

      recorder.start()
      setRecordingSeconds(0)
      setIsRecording(true)
      setNotice('Recording voice note...')

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((current) => current + 1)
      }, 1000)
    } catch (error) {
      stopRecordingStream()
      stopRecordingTimer()
      setIsRecording(false)
      setNotice(error instanceof Error ? error.message : 'Unable to start recording.')
    }
  }

  const handleSend = async (overrideText) => {
    const messageText = typeof overrideText === 'string' ? overrideText.trim() : draft.trim()
    const attachmentsToSend = pendingAttachments

    if (!messageText && attachmentsToSend.length === 0) {
      return
    }

    if (isRecording) {
      setNotice('Stop recording before sending the message.')
      return
    }

    setIsSending(true)
    setNotice('')

    const service = activeService ?? { id: 'general', shortLabel: 'General' }
    const timestamp = new Date().toISOString()
    let conversationId = activeConversationId
    let baseConversation = activeConversation

    try {
      if (!conversationId) {
        const createdConversation = await noraWorkspaceApi.createConversation({
          serviceId: service.id,
          title: deriveConversationTitle(messageText, `${service.shortLabel} Chat`),
        })

        conversationId = createdConversation.id
        baseConversation = createdConversation
        setActiveConversationId(createdConversation.id)
      }

      const optimisticConversation = {
        id: conversationId,
        title: deriveConversationTitle(messageText, `${service.shortLabel} Chat`),
        serviceId: service.id,
        updatedAt: timestamp,
        messages: [
          ...(baseConversation?.messages ?? []),
          {
            id: `pending-user-${timestamp}`,
            role: 'user',
            text: messageText,
            createdAt: timestamp,
            attachments: attachmentsToSend,
          },
          {
            id: `pending-assistant-${timestamp}`,
            role: 'assistant',
            text: '',
            createdAt: timestamp,
            attachments: [],
            isLoading: true,
            serviceLabel: service.shortLabel,
          },
        ],
      }

      setActiveConversation(optimisticConversation)
      setDraft('')
      setPendingAttachments([])
      upsertConversationSummary({
        id: optimisticConversation.id,
        title: optimisticConversation.title,
        serviceId: optimisticConversation.serviceId,
        updatedAt: optimisticConversation.updatedAt,
        preview: messageText,
        messageCount: optimisticConversation.messages.length,
      })

      const result = await noraWorkspaceApi.sendMessage({
        conversationId,
        serviceId: service.id,
        text: messageText,
        attachments: attachmentsToSend,
      })

      setActiveConversation(result.conversation)
      setSelectedServiceId(result.conversation.serviceId)
      setConversationList(await noraWorkspaceApi.listConversations())
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to send the message right now.')
    } finally {
      setIsSending(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div
      className={`nora-panel ${pairedWithTask ? 'nora-panel--paired' : 'nora-panel--single'} ${fullMode ? 'nora-panel--full' : ''} ${showConversation ? 'nora-panel--conversation' : 'nora-panel--welcome'}`}
    >
      <HistorySidebar
        conversations={conversationList}
        activeConversationId={activeConversationId}
        onSelect={(conversationId) => {
          void loadConversation(conversationId)
        }}
        onNewChat={handleNewChat}
        showAll={showAllHistory}
        onToggleShowAll={() => setShowAllHistory((current) => !current)}
      />

      <div className="nora-main-content">
        <div className="nora-bg-dot-grid" />
        <div className="nora-glow-top-right" />
        <div className="nora-glow-bottom-left" />

        {showConversation && !pairedWithTask && !fullMode ? (
  <div className="nora-project-list-wrapper">
    <ProjectList onNavigate={onClose} />
  </div>
) : null}
        {fullMode ? (
          <div className="nora-full-project-list">
            <ProjectList onNavigate={onNavigate} />
          </div>
        ) : (
          <button
            onClick={onClose}
            className={`nora-close-btn ${showConversation ? 'nora-close-btn--expand' : ''}`}
            type="button"
            aria-label="Close Nora workspace"
          >
            <CloseIcon expanded={showConversation} />
          </button>
        )}

        <header className="nora-header">
          <div className="nora-header-title">
            <span>{activeConversation?.title ?? 'New Chat'}</span>
            {showConversation ? (
              <button type="button" className="nora-title-edit-btn" aria-label="Edit conversation title">
                <EditIcon />
              </button>
            ) : null}
          </div>
        </header>

        {!showConversation ? (
          <div className="nora-top-tools">
            <ServicePicker
              services={services}
              activeServiceId={selectedServiceId}
              onSelect={setSelectedServiceId}
            />
          </div>
        ) : null}

        {notice ? <div className="nora-notice">{notice}</div> : null}

        {isInitializing ? (
          <div className="nora-workspace-loading">Loading Nora workspace...</div>
        ) : showConversation ? (
          <div className="nora-conversation-scene">
            {isLoadingConversation ? <div className="nora-workspace-loading">Loading conversation...</div> : null}

            {currentMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            <div ref={conversationEndRef} />
          </div>
        ) : (
          <div className="nora-welcome-scene">
            <NoraAvatar size={140} logoWidth={68} />
            <h2 className="nora-welcome-headline">{WELCOME_HEADLINE}</h2>
            <p className="nora-welcome-text">
              {WELCOME_TEXT}
              <span className="nora-caret" />
            </p>

            {activeService ? (
              <div className="nora-empty-state">
                <p className="nora-empty-state__eyebrow">Test Nora services</p>
                <p className="nora-empty-state__body">{activeService.description}</p>
                <div className="nora-quick-prompts">
                  {activeService.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="nora-quick-prompt"
                      onClick={() => {
                        void handleSend(suggestion)
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        <Composer
          draft={draft}
          onDraftChange={setDraft}
          onSend={() => {
            void handleSend()
          }}
          pendingAttachments={pendingAttachments}
          onRemoveAttachment={handleRemoveAttachment}
          onUpload={(kind, files) => {
            void handleUpload(kind, files)
          }}
          onToggleRecording={() => {
            void handleToggleRecording()
          }}
          isRecording={isRecording}
          recordingSeconds={recordingSeconds}
          isSending={isSending}
        />
      </div>
    </div>
  )
}
