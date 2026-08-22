import { useEffect, useState } from 'react'
import Layout from '../Layout'

type Menu = { name: string; photo: string }

/**
 * 부스 시연용 점심 룰렛.
 *
 * 뽑힌 메뉴의 사진을 크게 띄우는 것까지가 이 화면의 일입니다. 촬영 기능은 없습니다 —
 * 방문자가 모니터를 자기 휴대폰으로 찍는 용도라 사진을 되도록 크게 씁니다.
 *
 * 사진은 Unsplash 무료 라이선스 이미지를 CDN에서 바로 받습니다(핫링크가 라이선스로
 * 허용됩니다). 아래 photo id는 전부 실제로 200을 주는지, 사진이 메뉴 이름과 맞는지,
 * 그리고 먹음직스러운지 눈으로 골랐습니다. 새 메뉴를 추가할 때도 같이 확인하세요 —
 * Unsplash 검색 결과에는 다른 음식이 섞여 들어옵니다.
 */
const MENUS: Menu[] = [
  { name: '김치찌개', photo: 'photo-1743419612786-19d116bb8c40' },
  { name: '비빔밥', photo: 'photo-1718777791239-c473e9ce7376' },
  { name: '김밥', photo: 'photo-1656426548548-f006f0b38bcd' },
  { name: '떡볶이', photo: 'photo-1747228469541-f0e7f56e7ec7' },
  { name: '삼겹살', photo: 'photo-1743612828586-aeb6e7037b99' },
  { name: '돈까스', photo: 'photo-1677743540715-d4fe04852225' },
  { name: '라멘', photo: 'photo-1706128999187-327ac1ef054e' },
  { name: '초밥', photo: 'photo-1563612116625-3012372fccce' },
  { name: '파스타', photo: 'photo-1597131628347-c769fc631754' },
  { name: '샐러드', photo: 'photo-1546069901-ba9599a7e63c' },
]

// 모니터를 보고 찍는 용도라 화면에 760px까지 채웁니다. 2배 화면에서도 버티도록 넉넉히 받습니다
const photoUrl = (m: Menu) =>
  `https://images.unsplash.com/${m.photo}?auto=format&fit=crop&w=1200&h=900&q=70`

const SPIN_MS = 1500 // 룰렛이 돌아가는 시간
const TICK_MS = 90 // 불이 옆 칸으로 옮겨 가는 간격

type Stage = 'idle' | 'spinning' | 'picked'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 방금 나온 메뉴는 피해서 뽑습니다 — 두 번 연속 같은 메뉴가 나오면 룰렛 같지 않습니다. */
function pickOther(current: Menu | null) {
  const pool = current ? MENUS.filter((m) => m !== current) : MENUS
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function Lunch() {
  const [stage, setStage] = useState<Stage>('idle')
  const [menu, setMenu] = useState<Menu | null>(null)
  const [flash, setFlash] = useState<Menu>(MENUS[0])

  // 룰렛이 멈추자마자 사진이 떠 있도록 미리 받아 둡니다
  useEffect(() => {
    for (const m of MENUS) {
      const img = new Image()
      img.src = photoUrl(m)
    }
  }, [])

  function spin() {
    const picked = pickOther(menu)

    if (prefersReducedMotion()) {
      setMenu(picked)
      setStage('picked')
      return
    }

    setStage('spinning')
    let elapsed = 0
    const tick = window.setInterval(() => {
      elapsed += TICK_MS
      setFlash((prev) => pickOther(prev))
      if (elapsed >= SPIN_MS) {
        clearInterval(tick)
        setMenu(picked)
        setStage('picked')
      }
    }, TICK_MS)
  }

  // 판 위에서 불이 켜져 있는 칸 — 돌아가는 동안은 깜빡이는 칸, 멈추면 뽑힌 칸
  const lit = stage === 'spinning' ? flash : menu

  return (
    <Layout title="점심 룰렛 — 모모고">
      <main>
        <section className="roulette wrap">
          <h1>
            {stage === 'idle' && '점심을 골라주세요'}
            {stage === 'spinning' && '고르는 중…'}
            {stage === 'picked' && '오늘 점심은'}
          </h1>

          {/* 룰렛 판. 돌아가는 동안 불이 칸을 옮겨 다니고, 멈추면 뽑힌 칸에 남습니다 */}
          <ul className="roulette-board">
            {MENUS.map((m) => (
              <li
                key={m.name}
                className={m === lit ? 'roulette-chip is-lit' : 'roulette-chip'}
              >
                {m.name}
              </li>
            ))}
          </ul>

          {stage === 'idle' && (
            <>
              <p className="roulette-lead">오늘 뭐 먹을지 못 정했다면 룰렛에 맡겨 보세요.</p>
              <div className="roulette-actions">
                <button className="btn" type="button" onClick={spin}>
                  돌리기
                </button>
              </div>
            </>
          )}

          {stage === 'spinning' && (
            /* 빠르게 바뀌는 글자는 읽어 줄 필요가 없습니다 — 결과만 알립니다 */
            <p className="roulette-slot" aria-hidden="true">
              {flash.name}
            </p>
          )}

          {stage === 'picked' && menu && (
            <>
              {/* key를 메뉴 이름으로 둬 뽑힐 때마다 등장 모션이 다시 재생되게 합니다 */}
              <p className="roulette-slot is-result" key={menu.name} aria-live="polite">
                {menu.name}
              </p>

              <div className="roulette-photo" key={`photo-${menu.name}`}>
                <img src={photoUrl(menu)} alt={`${menu.name} 사진`} />
              </div>

              <p className="roulette-lead">휴대폰으로 이 화면을 찍어 한 장 남겨 보세요.</p>

              <div className="roulette-actions">
                <button className="btn ghost" type="button" onClick={spin}>
                  다시 돌리기
                </button>
              </div>

              <p className="roulette-note">음식 사진 출처 · Unsplash</p>
            </>
          )}
        </section>
      </main>
    </Layout>
  )
}
