import { useState } from 'react'
import { boards } from './data/boards'
import { users } from './data/users'
import QuadrantGrid from './components/QuadrantGrid'
import ProfileCard from './components/ProfileCard'

const MAX_PROFILES = 5

export default function App() {
  const [screen, setScreen] = useState('landing') // 'landing' | 'placing' | 'revealed'
  const [activeBoard, setActiveBoard] = useState(boards[0])
  const [userPosition, setUserPosition] = useState(null)
  const [viewedProfiles, setViewedProfiles] = useState([])
  const [activeProfile, setActiveProfile] = useState(null)

  const boardUsers = users.filter(u => u.positions[activeBoard.id])
  const canViewMore = viewedProfiles.length < MAX_PROFILES

  const handleDotClick = (user) => {
    if (!canViewMore && !viewedProfiles.includes(user.id)) return
    if (!viewedProfiles.includes(user.id)) {
      setViewedProfiles(prev => [...prev, user.id])
    }
    setActiveProfile(user)
  }

  const handleBoardSelect = (board) => {
    setActiveBoard(board)
    setUserPosition(null)
    setViewedProfiles([])
    setActiveProfile(null)
    setScreen('landing')
  }

  const handleBack = () => {
    setScreen('landing')
    setUserPosition(null)
  }

  // ── LANDING ─────────────────────────────────────────────────────────────────
  if (screen === 'landing') {
    return (
      <div
        className="flex flex-col items-center"
        style={{
          minHeight: '100dvh',
          background: '#0A0A0A',
          color: '#fff',
          maxWidth: 480,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between pt-14 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">2by2</h1>
            <p className="text-white/40 text-sm mt-0.5">Find your people</p>
          </div>
          <div
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,55,95,0.15)', color: '#FF375F' }}
          >
            Today's Board
          </div>
        </div>

        {/* Board topic pills */}
        <div className="w-full flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
          {boards.map(board => (
            <button
              key={board.id}
              onClick={() => handleBoardSelect(board)}
              className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-full transition-all"
              style={{
                background: activeBoard.id === board.id ? '#FF375F' : 'rgba(255,255,255,0.08)',
                color: activeBoard.id === board.id ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>{board.emoji}</span>
              <span>{board.title.split(' ').slice(0, 3).join(' ')}</span>
            </button>
          ))}
        </div>

        {/* Board card */}
        <div
          className="w-full mt-4 rounded-3xl flex flex-col"
          style={{ background: '#1A1A1A', padding: '24px 24px 28px', flex: '0 0 auto' }}
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold mb-1">{activeBoard.title}</h2>
            <p className="text-white/45 text-sm">{activeBoard.subtitle}</p>
          </div>

          {/* Preview grid */}
          <div className="w-full mb-6" style={{ paddingLeft: 32, paddingBottom: 28 }}>
            <QuadrantGrid board={activeBoard} />
          </div>

          {/* People count */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex -space-x-2">
              {boardUsers.slice(0, 4).map(u => (
                <div
                  key={u.id}
                  className="flex items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{
                    width: 28,
                    height: 28,
                    background: u.color,
                    border: '2px solid #1A1A1A',
                  }}
                >
                  {u.name[0]}
                </div>
              ))}
            </div>
            <span className="text-white/50 text-sm">
              {boardUsers.length} people placed themselves today
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={() => setScreen('placing')}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
            style={{ background: '#FF375F', boxShadow: '0 4px 20px rgba(255,55,95,0.4)' }}
          >
            Place Yourself →
          </button>
        </div>

        <p className="text-white/20 text-xs mt-6">Place yourself first, then see where everyone is</p>
      </div>
    )
  }

  // ── PLACING ─────────────────────────────────────────────────────────────────
  if (screen === 'placing') {
    return (
      <div
        className="flex flex-col"
        style={{
          minHeight: '100dvh',
          background: '#0A0A0A',
          color: '#fff',
          maxWidth: 480,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 pt-14 pb-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)' }}
          >
            ←
          </button>
          <div>
            <h2 className="font-bold text-base leading-tight">{activeBoard.title}</h2>
            <p className="text-white/40 text-xs">Tap to place yourself</p>
          </div>
        </div>

        {/* Instruction */}
        <div
          className="w-full text-center py-2 mb-4 rounded-xl text-sm"
          style={{
            background: userPosition ? 'rgba(255,55,95,0.1)' : 'rgba(255,255,255,0.05)',
            color: userPosition ? '#FF375F' : 'rgba(255,255,255,0.4)',
          }}
        >
          {userPosition
            ? `You're in: ${userPosition.x < 50 ? activeBoard.xAxis.left : activeBoard.xAxis.right} · ${userPosition.y > 50 ? activeBoard.yAxis.top : activeBoard.yAxis.bottom}`
            : 'Tap anywhere on the grid to place your dot'}
        </div>

        {/* Grid */}
        <div className="w-full" style={{ paddingLeft: 32, paddingBottom: 32 }}>
          <QuadrantGrid
            board={activeBoard}
            userPosition={userPosition}
            onGridTap={setUserPosition}
          />
        </div>

        {/* Confirm button */}
        <div className="mt-auto pb-10 pt-4">
          <button
            onClick={() => userPosition && setScreen('revealed')}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{
              background: userPosition ? '#FF375F' : 'rgba(255,255,255,0.1)',
              color: userPosition ? '#fff' : 'rgba(255,255,255,0.3)',
              boxShadow: userPosition ? '0 4px 20px rgba(255,55,95,0.4)' : 'none',
              cursor: userPosition ? 'pointer' : 'default',
            }}
          >
            {userPosition ? "I'm here — reveal everyone ✨" : 'Tap the grid first'}
          </button>
        </div>
      </div>
    )
  }

  // ── REVEALED ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col"
      style={{
        minHeight: '100dvh',
        background: '#0A0A0A',
        color: '#fff',
        maxWidth: 480,
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-14 pb-4">
        <div>
          <h2 className="font-bold text-base leading-tight">{activeBoard.title}</h2>
          <p className="text-white/40 text-xs">{boardUsers.length} people on the board</p>
        </div>
        <button
          onClick={handleBack}
          className="text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
        >
          Change board
        </button>
      </div>

      {/* Profile counter */}
      <div
        className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl mb-4"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <span className="text-sm text-white/50">
          {canViewMore
            ? 'Tap a dot to explore their profile'
            : "You've explored 5 profiles today"}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_PROFILES }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: 8,
                height: 8,
                background: i < viewedProfiles.length ? '#FF375F' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="w-full" style={{ paddingLeft: 32, paddingBottom: 32 }}>
        <QuadrantGrid
          board={activeBoard}
          userPosition={userPosition}
          otherUsers={boardUsers}
          revealed
          onDotClick={handleDotClick}
          viewedProfiles={viewedProfiles}
          canViewMore={canViewMore}
        />
      </div>

      {/* Bottom: show recently viewed profiles */}
      {viewedProfiles.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-white/30 mb-2 font-medium">Recently viewed</p>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {viewedProfiles.map(id => {
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
                    style={{
                      width: 52,
                      height: 52,
                      background: `${u.color}22`,
                      border: `2px solid ${u.color}55`,
                    }}
                  >
                    {u.emoji}
                  </div>
                  <span className="text-xs text-white/50">{u.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="pb-10" />

      {/* Profile card overlay */}
      {activeProfile && (
        <ProfileCard
          user={activeProfile}
          activeBoard={activeBoard}
          onClose={() => setActiveProfile(null)}
        />
      )}
    </div>
  )
}
