export default function QuadrantGrid({
  board,
  userPosition,
  otherUsers = [],
  revealed = false,
  onGridTap,
  onDotClick,
  viewedProfiles = [],
  savedProfiles = [],
  canViewMore = true,
}) {
  const handleClick = (e) => {
    if (!onGridTap) return
    const rect = e.currentTarget.getBoundingClientRect()
    const rawX = (e.clientX - rect.left) / rect.width
    const rawY = (e.clientY - rect.top) / rect.height
    const x = Math.max(2, Math.min(98, rawX * 100))
    const y = Math.max(2, Math.min(98, (1 - rawY) * 100))
    onGridTap({ x, y })
  }

  return (
    <div className="w-full relative" style={{ aspectRatio: '1 / 1' }}>
      {/* Grid container */}
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={handleClick}
      >
        {/* Quadrant lines */}
        <div
          className="absolute top-1/2 left-0 right-0"
          style={{ height: '1px', background: 'rgba(255,255,255,0.12)', transform: 'translateY(-50%)' }}
        />
        <div
          className="absolute left-1/2 top-0 bottom-0"
          style={{ width: '1px', background: 'rgba(255,255,255,0.12)', transform: 'translateX(-50%)' }}
        />

        {/* Other user dots */}
        {revealed && otherUsers.map((user, i) => {
          const pos = user.positions[board.id]
          if (!pos) return null
          const isSaved = savedProfiles.includes(user.id)
          const isViewed = viewedProfiles.includes(user.id)
          const isClickable = canViewMore || isViewed || isSaved
          return (
            <button
              key={user.id}
              className={`dot-revealed absolute flex items-center justify-center rounded-full text-xs font-bold${isSaved ? ' pulse-ring' : ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${100 - pos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: isSaved ? 38 : 36,
                height: isSaved ? 38 : 36,
                background: user.color,
                animationDelay: `${i * 60}ms`,
                opacity: 0,
                cursor: isClickable ? 'pointer' : 'default',
                filter: !isClickable ? 'grayscale(0.6) brightness(0.6)' : 'none',
                boxShadow: isSaved
                  ? `0 0 0 3px #fff, 0 0 0 6px ${user.color}55`
                  : isViewed
                  ? `0 0 0 2px rgba(255,255,255,0.5)`
                  : `0 2px 8px ${user.color}66`,
                zIndex: isSaved ? 15 : 10,
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (isClickable && onDotClick) onDotClick(user)
              }}
            >
              {user.name[0]}
            </button>
          )
        })}

        {/* User's own dot */}
        {userPosition && (
          <div
            className="absolute flex items-center justify-center rounded-full text-xs font-bold pulse-ring"
            style={{
              left: `${userPosition.x}%`,
              top: `${100 - userPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 40,
              background: '#FF375F',
              color: '#fff',
              boxShadow: '0 0 0 3px rgba(255,55,95,0.3), 0 4px 16px rgba(255,55,95,0.5)',
              zIndex: 20,
              position: 'absolute',
              pointerEvents: 'none',
            }}
          >
            You
          </div>
        )}
      </div>

      {/* Axis labels outside the grid */}
      {/* X axis */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-1">
        <span className="text-[13px] text-white font-semibold">← {board.xAxis.left}</span>
        <span className="text-[13px] text-white font-semibold">{board.xAxis.right} →</span>
      </div>
      {/* Y axis */}
      <div className="absolute top-0 bottom-0 flex flex-col justify-between py-1 items-center" style={{ width: 32, left: -36 }}>
        <span
          className="text-[13px] text-white font-semibold whitespace-nowrap"
          style={{ transform: 'rotate(-90deg) translateX(50%)', transformOrigin: 'center', position: 'absolute', top: '25%' }}
        >
          {board.yAxis.top}
        </span>
        <span
          className="text-[13px] text-white font-semibold whitespace-nowrap"
          style={{ transform: 'rotate(-90deg) translateX(-50%)', transformOrigin: 'center', position: 'absolute', top: '75%' }}
        >
          {board.yAxis.bottom}
        </span>
      </div>
    </div>
  )
}
