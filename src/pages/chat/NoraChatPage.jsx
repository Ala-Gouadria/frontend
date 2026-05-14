import MainNav from '../../components/layout/MainNav'
import Photo from '../../components/layout/Photo'
import NoraWorkspace from '../../components/nora/NoraWorkspace'
import './NoraChatPage.css'

export default function NoraChatPage({ onNavigate }) {
  return (
    <main className="nora-chat-page">
      <Photo />
      <MainNav activeId="chat" onSelect={onNavigate} />
      <NoraWorkspace open fullMode onNavigate={onNavigate} onClose={() => onNavigate?.('stars')} />
    </main>
  )
}
