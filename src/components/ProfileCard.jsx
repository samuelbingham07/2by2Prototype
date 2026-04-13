import { boards } from '../data/boards'

export default function ProfileCard({ user, activeBoard, onClose }) {
  const pos = user.positions[activeBoard.id]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 fade-in"
        style={{ background: 'rgba(0,0,0,0.6)', zIndex: 40, backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="fixed left-0 right-0 bottom-0 slide-up"
        style={{
          zIndex: 50,
          background: '#1C1C1E',
          borderRadius: '28px 28px 0 0',
          padding: '8px 0 32px',
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-4">
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-full text-white/85 hover:text-white transition-colors"
          style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.1)' }}
        >
          ✕
        </button>

        <div className="px-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="flex items-center justify-center rounded-2xl text-4xl"
              style={{ width: 72, height: 72, background: `${user.color}22`, border: `2px solid ${user.color}44` }}
            >
              {user.emoji}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-white text-2xl font-bold">{user.name}</h2>
                <span className="text-white/80 text-lg">{user.age}</span>
              </div>
              <div className="flex gap-2 mt-1">
                {user.interests.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: `${user.color}22`, color: user.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-white/90 text-sm leading-relaxed mb-5">{user.bio}</p>

          {/* Their position on the active board */}
          {pos && (
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-xs text-white/70 mb-3 font-medium uppercase tracking-wide">
                Their spot on "{activeBoard.title}"
              </p>
              <div className="relative" style={{ aspectRatio: '1/1', width: '100%', maxWidth: 180, margin: '0 auto' }}>
                {/* Mini grid */}
                <div
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="absolute top-1/2 left-0 right-0" style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                  <div className="absolute left-1/2 top-0 bottom-0" style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />

                  {/* Axis mini labels */}
                  <span className="absolute bottom-1 left-1 text-[8px] text-white/25">{activeBoard.xAxis.left}</span>
                  <span className="absolute bottom-1 right-1 text-[8px] text-white/25 text-right">{activeBoard.xAxis.right}</span>
                  <span className="absolute top-1 left-1 text-[8px] text-white/25">{activeBoard.yAxis.top}</span>
                  <span className="absolute bottom-4 left-1 text-[8px] text-white/25">{activeBoard.yAxis.bottom}</span>

                  {/* Their dot */}
                  <div
                    className="absolute flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{
                      left: `${pos.x}%`,
                      top: `${100 - pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 28,
                      height: 28,
                      background: user.color,
                      boxShadow: `0 2px 8px ${user.color}88`,
                    }}
                  >
                    {user.name[0]}
                  </div>
                </div>

                {/* Axis labels below/beside mini grid */}
              </div>

              {/* Quadrant position text */}
              <p className="text-center text-xs text-white/70 mt-3">
                {pos.x < 50 ? activeBoard.xAxis.left : activeBoard.xAxis.right}
                {' · '}
                {pos.y > 50 ? activeBoard.yAxis.top : activeBoard.yAxis.bottom}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
