import { useState } from 'react'
import { boards } from './data/boards'
import { users } from './data/users'
import QuadrantGrid from './components/QuadrantGrid'
import ProfileCard from './components/ProfileCard'

const MAX_PROFILES = 5

const MODE_OPTIONS = [
  { value: 'friendship', label: 'Friendship' },
  { value: 'default',    label: 'Default' },
  { value: 'romance',    label: 'Romance' },
]

function ModeSlider({ mode, onChange }) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 999,
        padding: 3,
        gap: 2,
        width: '100%',
      }}
    >
      {MODE_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            padding: '6px 0',
            borderRadius: 999,
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            background: mode === opt.value ? '#FF375F' : 'transparent',
            color: mode === opt.value ? '#fff' : 'rgba(255,255,255,0.5)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', flexShrink: 0,
        background: on ? '#FF375F' : 'rgba(255,255,255,0.15)',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

const PREF_ITEMS = [
  { key: 'orientation', label: 'Sexual orientation', desc: 'Only show compatible orientations' },
  { key: 'age',         label: 'Age range',          desc: 'Filter to your preferred age range' },
  { key: 'location',    label: 'Location',            desc: 'Show people near you' },
  { key: 'sameND',      label: 'Same neurodivergence', desc: 'Only show people with a similar ND profile' },
]

function BottomSheet({ onClose, children }) {
  return (
    <>
      <div className="fixed inset-0 fade-in" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="fixed left-0 right-0 bottom-0 slide-up" style={{ zIndex: 50, background: '#1C1C1E', borderRadius: '28px 28px 0 0', padding: '8px 0 40px', maxWidth: 480, margin: '0 auto' }}>
        <div className="flex justify-center pt-2 pb-4">
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 flex items-center justify-center rounded-full text-white/85" style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)' }}>✕</button>
        {children}
      </div>
    </>
  )
}

function PrefsPanel({ prefs, onChange, onClose }) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="px-6">
        <h2 className="text-white text-xl font-bold mb-1">Preferences</h2>
        <p className="text-white/60 text-sm mb-6">Control who appears in your Hiki Grids</p>
        <div className="flex flex-col gap-1">
          {PREF_ITEMS.map((item, i) => (
            <div key={item.key}>
              <div className="flex items-center justify-between py-4">
                <div className="flex-1 pr-4">
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-white/55 text-xs mt-0.5">{item.desc}</p>
                </div>
                <Toggle on={prefs[item.key]} onToggle={() => onChange({ ...prefs, [item.key]: !prefs[item.key] })} />
              </div>
              {i < PREF_ITEMS.length - 1 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  )
}

function AboutPanel({ prefs, onClose }) {
  const activeFilters = [
    prefs.orientation && 'sexual orientation',
    prefs.age && 'age range',
    prefs.location && 'location',
    prefs.sameND && 'neurodivergence',
  ].filter(Boolean)

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-6 overflow-y-auto" style={{ maxHeight: '75vh' }}>
        <h2 className="text-white text-xl font-bold mb-1">About Hiki Grids</h2>
        <p className="text-white/60 text-sm mb-6">A new way to find people on Hiki</p>

        <div className="flex flex-col gap-4 mb-6">
          {[
            { icon: '📍', step: 'Pick a grid', desc: 'A new topic drops every day — energy, food, communication style, and more.' },
            { icon: '👆', step: 'Place yourself', desc: 'Tap anywhere on the grid to show where you stand on the two axes.' },
            { icon: '👀', step: 'See the board', desc: 'Once you place yourself, everyone else\'s dots are revealed.' },
            { icon: '💬', step: 'Explore & connect', desc: 'Tap any dot to see their profile. Save up to 5 people to your list.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0 text-lg" style={{ width: 40, height: 40, background: 'rgba(255,55,95,0.1)', border: '1px solid rgba(255,55,95,0.2)' }}>
                {item.icon}
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-0.5">{item.step}</p>
                <p className="text-white/65 text-sm leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

        <div className="flex items-start gap-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px' }}>
          <span style={{ fontSize: 16, marginTop: 1 }}>✓</span>
          <p className="text-white/75 text-sm leading-snug">
            {activeFilters.length > 0
              ? <>Everyone you see is filtered by <strong className="text-white">{activeFilters.join(', ')}</strong>.</>
              : 'No filters are currently active.'}
          </p>
        </div>
      </div>
    </BottomSheet>
  )
}

export default function App() {
  const [screen, setScreen] = useState('intro') // 'intro' | 'landing' | 'revealed' | 'finished'
  const [mode, setMode] = useState('default') // 'friendship' | 'default' | 'romance'
  const [prefs, setPrefs] = useState({ orientation: true, age: true, location: true, sameND: false })
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [activeBoard, setActiveBoard] = useState(boards[0])
  const [boardLocked, setBoardLocked] = useState(false)
  const [userPosition, setUserPosition] = useState(null)
  const [viewedProfiles, setViewedProfiles] = useState([])   // all tapped (unlimited)
  const [savedProfiles, setSavedProfiles] = useState([])    // explicitly saved (max 5)
  const [activeProfile, setActiveProfile] = useState(null)

  // Finished screen interaction state
  const [likedProfiles, setLikedProfiles] = useState(new Set())
  const [passedProfiles, setPassedProfiles] = useState(new Set())
  const [composingFor, setComposingFor] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [sentMessages, setSentMessages] = useState(new Set())

  const boardUsers = users.filter(u => u.positions[activeBoard.id])
  const canSaveMore = savedProfiles.length < MAX_PROFILES
  const pickedUsers = savedProfiles.map(id => users.find(u => u.id === id)).filter(Boolean)

  const modeText = {
    tagline: {
      friendship: 'A new way to match!',
      default:    'A new way to match!',
      romance:    'A new way to match!',
    },
    addBtn: {
      friendship: { idle: '+ Add Friend', done: '✓ Friend Added' },
      default:    { idle: '+ Connect',    done: '✓ Connected' },
      romance:    { idle: '🤍 Like',       done: '❤️ Liked' },
    },
    savedLabel: {
      friendship: 'Added',
      default:    'Connected',
      romance:    'Liked',
    },
    finishedDesc: {
      friendship: 'Add friends, message, or pass — anyone you connect with will appear in your Hiki inbox.',
      default:    'Connect, message, or pass — anyone you reach out to will appear in your Hiki inbox.',
      romance:    'Like, message, or pass — anyone you connect with will appear in your Hiki inbox.',
    },
    finishCta: {
      friendship: 'See your 5 picks → Add friends & connect',
      default:    'See your 5 picks → Connect & message',
      romance:    'See your 5 picks → Like, message & connect',
    },
  }

  const handleDotClick = (user) => {
    if (!viewedProfiles.includes(user.id)) {
      setViewedProfiles(prev => [...prev, user.id])
    }
    setActiveProfile(user)
  }

  const handleSaveProfile = (user) => {
    if (!canSaveMore || savedProfiles.includes(user.id)) return
    setSavedProfiles(prev => [...prev, user.id])
  }

  const handleBoardSelect = (board) => {
    setActiveBoard(board)
    setUserPosition(null)
    setViewedProfiles([])
    setSavedProfiles([])
    setActiveProfile(null)
    setScreen('landing')
  }

  // Back from revealed → landing: keep board locked, just re-place
  const handleBack = () => {
    setScreen('landing')
    setUserPosition(null)
    setViewedProfiles([])
    setSavedProfiles([])
  }

  // Full reset from finished screen only
  const handleFullReset = () => {
    setBoardLocked(false)
    setUserPosition(null)
    setViewedProfiles([])
    setSavedProfiles([])
    setActiveProfile(null)
    setScreen('landing')
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !composingFor) return
    setSentMessages(prev => new Set([...prev, composingFor.id]))
    setMessageText('')
    setComposingFor(null)
  }

  const toggleLike = (userId) => {
    setLikedProfiles(prev => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
    setPassedProfiles(prev => { const next = new Set(prev); next.delete(userId); return next })
  }

  const togglePass = (userId) => {
    setPassedProfiles(prev => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
    setLikedProfiles(prev => { const next = new Set(prev); next.delete(userId); return next })
  }

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div
        className="flex flex-col"
        style={{
          minHeight: '100vh',
          background: '#0A0A0A',
          color: '#fff',
          maxWidth: 480,
          margin: '0 auto',
          padding: '0 24px 48px',
          cursor: 'pointer',
        }}
        onClick={() => setScreen('landing')}
      >
        {/* Hero */}
        <div className="text-center mb-8 pt-16">
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 16 }}>⊞</div>
          <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ lineHeight: 1.15 }}>
            Hiki Grids
          </h1>
          <p className="text-white/80 text-base leading-relaxed" style={{ maxWidth: 320, margin: '0 auto' }}>
            {modeText.tagline[mode]}
          </p>
        </div>

        {/* Mode selector */}
        <div className="w-full mb-6" onClick={e => e.stopPropagation()}>
          <p className="text-xs text-white/50 font-medium mb-2 uppercase tracking-wide">I'm looking for</p>
          <ModeSlider mode={mode} onChange={setMode} />
        </div>

        {/* First-time filter setup */}
        <div className="w-full mb-6 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', padding: '4px 0' }} onClick={e => e.stopPropagation()}>
          <p className="text-xs text-white/50 font-medium uppercase tracking-wide px-5 pt-4 pb-3">Show me people filtered by</p>
          {PREF_ITEMS.map((item, i) => (
            <div key={item.key}>
              <div className="flex items-center justify-between px-5 py-3">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <Toggle on={prefs[item.key]} onToggle={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))} />
              </div>
              {i < PREF_ITEMS.length - 1 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />}
            </div>
          ))}
        </div>

        {/* Change anytime note */}
        <p className="text-center text-white/45 text-xs mb-6" onClick={e => e.stopPropagation()}>
          You can change these — and other preferences — anytime from the Grids screen.
        </p>

        {/* Tap anywhere hint */}
        <p className="text-center text-white/50 text-sm">tap anywhere to begin</p>
      </div>
    )
  }

  // ── LANDING (with inline placement) ─────────────────────────────────────────
  if (screen === 'landing') {
    return (
      <div
        className="flex flex-col"
        style={{
          minHeight: '100vh',
          background: '#0A0A0A',
          color: '#fff',
          maxWidth: 480,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* Header */}
        <div className="w-full flex items-center gap-3 pt-12 pb-4">
          <button
            onClick={() => setScreen('intro')}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)' }}
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Hiki Grids</h1>
            <p className="text-white/75 text-xs mt-0.5">Today's matching board</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setAboutOpen(true)}
              className="flex items-center justify-center rounded-full text-xs font-semibold"
              style={{ height: 36, padding: '0 14px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.82)' }}
            >
              About
            </button>
            <button
              onClick={() => setPrefsOpen(true)}
              className="flex items-center justify-center rounded-full text-xs font-semibold"
              style={{ height: 36, padding: '0 14px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.82)' }}
            >
              Preferences
            </button>
          </div>
        </div>
        {aboutOpen && <AboutPanel prefs={prefs} onClose={() => setAboutOpen(false)} />}
        {prefsOpen && <PrefsPanel prefs={prefs} onChange={setPrefs} onClose={() => setPrefsOpen(false)} />}

        {/* Board selection label */}
        <div className="w-full flex items-center justify-between mb-2">
          {boardLocked && !activeBoard.permanent ? (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold" style={{ color: '#FF375F' }}>🔒 In the app, you'd only get one daily board</span>
            </div>
          ) : (
            <p className="text-xs text-white/75 font-medium">New daily board every day · pick one</p>
          )}
        </div>

        {/* Board topic pills */}
        <div className="w-full flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
          {boards.map(board => {
            const isActive = activeBoard.id === board.id
            return (
              <button
                key={board.id}
                onClick={() => handleBoardSelect(board)}
                className="flex-shrink-0 flex flex-col items-center gap-0.5 text-sm font-medium px-3.5 rounded-2xl transition-all"
                style={{
                  paddingTop: 6,
                  paddingBottom: 6,
                  background: isActive ? '#FF375F' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.82)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span>{board.emoji}</span>
                  <span>{board.title.split(' ').slice(0, 2).join(' ')}</span>
                </div>
                <span style={{ fontSize: 9, opacity: 0.7, fontWeight: 500, letterSpacing: '0.03em' }}>
                  {board.day}
                </span>
              </button>
            )
          })}
        </div>

        {/* Board title */}
        <div className="w-full mt-1 mb-3">
          <h2 className="text-lg font-bold">{activeBoard.title}</h2>
          <p className="text-white/80 text-sm mt-0.5">{activeBoard.subtitle}</p>
        </div>

        {/* Placement status */}
        <div
          className="w-full text-center py-2 mb-3 rounded-xl text-sm font-medium"
          style={{
            background: userPosition ? 'rgba(255,55,95,0.1)' : 'rgba(255,255,255,0.05)',
            color: userPosition ? '#FF375F' : 'rgba(255,255,255,0.78)',
          }}
        >
          {userPosition
            ? `You're here: ${userPosition.x < 50 ? activeBoard.xAxis.left : activeBoard.xAxis.right} · ${userPosition.y > 50 ? activeBoard.yAxis.top : activeBoard.yAxis.bottom}`
            : 'Tap the grid to place yourself'}
        </div>

        {/* Interactive grid */}
        <div className="w-full" style={{ paddingLeft: 32, paddingBottom: 32 }}>
          <QuadrantGrid
            board={activeBoard}
            userPosition={userPosition}
            onGridTap={setUserPosition}
          />
        </div>

        {/* People count */}
        <div className="flex items-center gap-2 mt-1 mb-4">
          <div className="flex -space-x-2">
            {boardUsers.slice(0, 4).map(u => (
              <div
                key={u.id}
                className="flex items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ width: 26, height: 26, background: u.color, border: '2px solid #0A0A0A' }}
              >
                {u.name[0]}
              </div>
            ))}
          </div>
          <span className="text-white/80 text-sm">{boardUsers.length} people placed themselves today</span>
        </div>

        {/* Reveal CTA — only active after placing */}
        <button
          onClick={() => { if (userPosition) { setBoardLocked(true); setScreen('revealed') } }}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={{
            background: userPosition ? '#FF375F' : 'rgba(255,255,255,0.08)',
            color: userPosition ? '#fff' : 'rgba(255,255,255,0.35)',
            boxShadow: userPosition ? '0 4px 20px rgba(255,55,95,0.4)' : 'none',
            cursor: userPosition ? 'pointer' : 'default',
          }}
        >
          {userPosition ? "Reveal everyone ✨" : 'Place yourself to reveal the board'}
        </button>

        <div className="pb-10" />
      </div>
    )
  }

  // ── FINISHED ────────────────────────────────────────────────────────────────
  if (screen === 'finished') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A0A0A',
          color: '#fff',
          maxWidth: 480,
          margin: '0 auto',
          padding: '0 20px 48px',
        }}
      >
        {/* Header */}
        <div className="pt-14 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 26 }}>🎉</span>
            <h1 className="text-2xl font-bold tracking-tight">Your 5 picks</h1>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            {modeText.finishedDesc[mode]}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4 mb-6">
          {[
            { label: modeText.savedLabel[mode], count: likedProfiles.size, color: '#FF375F' },
            { label: 'Messaged', count: sentMessages.size, color: '#3B82F6' },
            { label: 'Passed', count: passedProfiles.size, color: 'rgba(255,255,255,0.3)' },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex-1 rounded-2xl text-center py-3"
              style={{ background: '#1A1A1A' }}
            >
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.count}</p>
              <p className="text-xs text-white/65 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Profile action cards */}
        <div className="flex flex-col gap-3">
          {pickedUsers.map((user, i) => {
            const isLiked = likedProfiles.has(user.id)
            const isPassed = passedProfiles.has(user.id)
            const isSent = sentMessages.has(user.id)
            return (
              <div
                key={user.id}
                className="rounded-2xl fade-in"
                style={{
                  background: '#1A1A1A',
                  border: isLiked
                    ? '1px solid rgba(255,55,95,0.4)'
                    : isPassed
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid rgba(255,255,255,0.08)',
                  opacity: isPassed ? 0.5 : 1,
                  animationDelay: `${i * 80}ms`,
                  transition: 'opacity 0.2s, border 0.2s',
                  padding: '16px',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center justify-center rounded-2xl text-2xl flex-shrink-0"
                    style={{ width: 52, height: 52, background: `${user.color}22`, border: `2px solid ${user.color}44` }}
                  >
                    {user.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base">{user.name}</span>
                      <span className="text-white/75 text-sm">{user.age}</span>
                      {isLiked && <span className="text-xs ml-auto" style={{ color: '#FF375F' }}>{modeText.addBtn[mode].done}</span>}
                      {isSent && !isLiked && <span className="text-xs ml-auto" style={{ color: '#3B82F6' }}>Sent 💬</span>}
                    </div>
                    <p className="text-white/75 text-xs mt-0.5 leading-snug" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {user.bio}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleLike(user.id)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{
                      background: isLiked ? 'rgba(255,55,95,0.2)' : 'rgba(255,255,255,0.07)',
                      color: isLiked ? '#FF375F' : 'rgba(255,255,255,0.82)',
                      border: isLiked ? '1px solid rgba(255,55,95,0.4)' : '1px solid transparent',
                    }}
                  >
                    {isLiked ? modeText.addBtn[mode].done : modeText.addBtn[mode].idle}
                  </button>
                  <button
                    onClick={() => { setComposingFor(user); setMessageText('') }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{
                      background: isSent ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.07)',
                      color: isSent ? '#3B82F6' : 'rgba(255,255,255,0.82)',
                      border: isSent ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                    }}
                  >
                    {isSent ? '💬 Sent' : '💬 Message'}
                  </button>
                  <button
                    onClick={() => togglePass(user.id)}
                    className="py-2.5 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      color: isPassed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.82)',
                      border: '1px solid transparent',
                    }}
                  >
                    {isPassed ? 'Undo' : '✕'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handleFullReset}
          className="w-full mt-6 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)' }}
        >
          ← Start over
        </button>

        {/* Message compose overlay */}
        {composingFor && (
          <>
            <div
              className="fixed inset-0 fade-in"
              style={{ background: 'rgba(0,0,0,0.7)', zIndex: 40, backdropFilter: 'blur(4px)' }}
              onClick={() => setComposingFor(null)}
            />
            <div
              className="fixed left-0 right-0 bottom-0 slide-up"
              style={{ zIndex: 50, background: '#1C1C1E', borderRadius: '28px 28px 0 0', padding: '8px 0 40px', maxWidth: 480, margin: '0 auto' }}
            >
              <div className="flex justify-center pt-2 pb-4">
                <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
              </div>
              <div className="px-5">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="flex items-center justify-center rounded-xl text-2xl"
                    style={{ width: 44, height: 44, background: `${composingFor.color}22`, border: `2px solid ${composingFor.color}44` }}
                  >
                    {composingFor.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-base">Message {composingFor.name}</p>
                    <p className="text-white/75 text-xs">{composingFor.age} · {composingFor.interests[0]}</p>
                  </div>
                </div>
                <p className="text-xs text-white/65 mb-2 font-medium">Quick openers</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    `Hey ${composingFor.name}! Saw we landed in a similar spot 👀`,
                    'Would love to chat more about this!',
                    `Your "${composingFor.interests[0]}" interest caught my eye 😄`,
                  ].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setMessageText(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.82)' }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div
                  className="flex items-end gap-2 rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <textarea
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder={`Say something to ${composingFor.name}...`}
                    rows={2}
                    className="flex-1 bg-transparent text-sm outline-none resize-none"
                    style={{ color: '#fff', caretColor: '#FF375F' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="flex-shrink-0 flex items-center justify-center rounded-xl transition-all active:scale-95"
                    style={{
                      width: 36, height: 36,
                      background: messageText.trim() ? '#FF375F' : 'rgba(255,255,255,0.1)',
                      color: messageText.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // ── REVEALED ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        color: '#fff',
        maxWidth: 480,
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      <div className="flex items-center gap-3 pt-14 pb-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)' }}
        >
          ←
        </button>
        <div>
          <h2 className="font-bold text-base leading-tight">{activeBoard.title}</h2>
          <p className="text-white/75 text-xs">{boardUsers.length} people on the board</p>
        </div>
      </div>

      <div
        className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl mb-4"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <span className="text-sm text-white/80">
          {savedProfiles.length === 0
            ? 'Tap a dot · add up to 5 to your list'
            : canSaveMore
            ? `${savedProfiles.length}/5 saved — be selective`
            : "List full · ready to connect"}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_PROFILES }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{ width: 8, height: 8, background: i < savedProfiles.length ? '#FF375F' : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>
      </div>

      <div className="w-full" style={{ paddingLeft: 32, paddingBottom: 32 }}>
        <QuadrantGrid
          board={activeBoard}
          userPosition={userPosition}
          otherUsers={boardUsers}
          revealed
          onDotClick={handleDotClick}
          viewedProfiles={savedProfiles}
          canViewMore={true}
        />
      </div>

      {savedProfiles.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-white/65 mb-2 font-medium">Your list</p>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {savedProfiles.map(id => {
              const u = users.find(u => u.id === id)
              if (!u) return null
              return (
                <button
                  key={u.id}
                  onClick={() => setActiveProfile(u)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <div
                    className="flex items-center justify-center rounded-2xl text-2xl"
                    style={{ width: 52, height: 52, background: `${u.color}22`, border: `2px solid ${u.color}55` }}
                  >
                    {u.emoji}
                  </div>
                  <span className="text-xs text-white/80">{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {!canSaveMore && (
        <div className="mt-5 fade-in">
          <button
            onClick={() => setScreen('finished')}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF375F, #FF6B9D)', boxShadow: '0 4px 24px rgba(255,55,95,0.45)' }}
          >
            {modeText.finishCta[mode]}
          </button>
          <p className="text-center text-white/60 text-xs mt-3">
            Your connections will appear in your Hiki inbox
          </p>
        </div>
      )}

      <div className="pb-10" />

      {activeProfile && (
        <ProfileCard
          user={activeProfile}
          activeBoard={activeBoard}
          onClose={() => setActiveProfile(null)}
          onSave={handleSaveProfile}
          isSaved={savedProfiles.includes(activeProfile.id)}
          canSave={canSaveMore}
          addBtnText={modeText.addBtn[mode]}
        />
      )}
    </div>
  )
}
