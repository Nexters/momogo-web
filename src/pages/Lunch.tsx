import { useCallback, useEffect, useRef, useState } from 'react'
import Layout from '../Layout'

type Menu = { name: string; photo: string }

/**
 * 부스 시연용 점심 룰렛.
 *
 * 사진은 Unsplash 무료 라이선스 이미지를 CDN에서 바로 받습니다(핫링크가 라이선스로
 * 허용됩니다). 아래 photo id는 전부 실제로 200을 주는지, 그리고 사진이 메뉴 이름과
 * 맞는지 눈으로 확인한 것만 넣었습니다. 새 메뉴를 추가할 때도 같이 확인하세요.
 */
const MENUS: Menu[] = [
  { name: '김치찌개', photo: 'photo-1704890514547-b6b7d64086c1' },
  { name: '비빔밥', photo: 'photo-1553163147-622ab57be1c7' },
  { name: '김밥', photo: 'photo-1656428254987-45d97432714b' },
  { name: '떡볶이', photo: 'photo-1597577616046-acedbd9af8c8' },
  { name: '삼겹살', photo: 'photo-1548959466-3a93a7b224e8' },
  { name: '돈까스', photo: 'photo-1677743540715-d4fe04852225' },
  { name: '라멘', photo: 'photo-1612927601601-6638404737ce' },
  { name: '초밥', photo: 'photo-1579584425555-c3ce17fd4351' },
  { name: '파스타', photo: 'photo-1473093226795-af9932fe5856' },
  { name: '샐러드', photo: 'photo-1512621776951-a57141f2eefd' },
]

const photoUrl = (m: Menu) =>
  `https://images.unsplash.com/${m.photo}?auto=format&fit=crop&w=800&h=600&q=70`

const SPIN_MS = 1500 // 룰렛이 돌아가는 시간
const TICK_MS = 90 // 메뉴 이름이 바뀌는 간격

type Stage = 'idle' | 'spinning' | 'picked' | 'camera' | 'shot'

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
  const [shot, setShot] = useState<string | null>(null)
  const [camError, setCamError] = useState<string | null>(null)
  const [mirrored, setMirrored] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timersRef = useRef<number[]>([])

  // 룰렛이 돌자마자 사진이 떠 있도록 미리 받아 둡니다
  useEffect(() => {
    for (const m of MENUS) {
      const img = new Image()
      img.src = photoUrl(m)
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  // 페이지를 벗어날 때 카메라 불이 켜진 채로 남지 않게 합니다
  useEffect(() => {
    return () => {
      stopCamera()
      timersRef.current.forEach(clearTimeout)
    }
  }, [stopCamera])

  // <video>는 stage가 'camera'가 된 뒤에 붙으므로, 스트림 연결도 그때 합니다
  useEffect(() => {
    if (stage !== 'camera' || !videoRef.current || !streamRef.current) return
    videoRef.current.srcObject = streamRef.current
  }, [stage])

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

  async function openCamera() {
    setCamError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('이 브라우저에서는 카메라를 열 수 없습니다.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      // 노트북 전면 카메라는 좌우를 뒤집어 보여주는 편이 자연스럽습니다
      const facing = stream.getVideoTracks()[0]?.getSettings().facingMode
      setMirrored(facing !== 'environment')
      setStage('camera')
    } catch {
      setCamError('카메라를 쓸 수 없습니다. 권한을 허용했는지 확인해 주세요.')
    }
  }

  function shoot() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const w = video.videoWidth
    const h = video.videoHeight
    if (!w || !h) return // 아직 첫 프레임이 안 왔습니다

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (mirrored) {
      // 미리보기와 결과가 어긋나지 않도록 화면과 같은 방향으로 뒤집어 그립니다
      ctx.translate(w, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0, w, h)

    setShot(canvas.toDataURL('image/jpeg', 0.9))
    stopCamera()
    setStage('shot')
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setShot(String(reader.result))
      setCamError(null)
      setStage('shot')
    }
    reader.readAsDataURL(file)
  }

  function reset() {
    stopCamera()
    setShot(null)
    setCamError(null)
    setStage('idle')
    setMenu(null)
  }

  return (
    <Layout title="점심 룰렛 — 모모고">
      <main>
        <section className="roulette wrap">
          {stage === 'idle' && (
            <>
              <h1>점심을 골라주세요</h1>
              <p className="roulette-lead">
                오늘 뭐 먹을지 못 정했다면 룰렛에 맡겨 보세요. 고른 메뉴로 한 장 남기면
                끝입니다.
              </p>
              <div className="roulette-actions">
                <button className="btn" type="button" onClick={spin}>
                  돌리기
                </button>
              </div>
            </>
          )}

          {stage === 'spinning' && (
            <>
              <h1>고르는 중…</h1>
              {/* 빠르게 바뀌는 글자는 읽어 줄 필요가 없습니다 — 결과만 알립니다 */}
              <p className="roulette-slot" aria-hidden="true">
                {flash.name}
              </p>
            </>
          )}

          {(stage === 'picked' || stage === 'shot') && menu && (
            <>
              <h1>{stage === 'shot' ? '오늘 한 장' : '오늘 점심은'}</h1>
              <p className="roulette-slot" aria-live="polite">
                {menu.name}
              </p>

              <div className="roulette-photo">
                <img
                  src={stage === 'shot' && shot ? shot : photoUrl(menu)}
                  alt={stage === 'shot' ? `직접 찍은 ${menu.name} 사진` : `${menu.name} 사진`}
                />
              </div>

              <div className="roulette-actions">
                {stage === 'picked' ? (
                  <button className="btn" type="button" onClick={openCamera}>
                    사진 찍기
                  </button>
                ) : (
                  <button className="btn" type="button" onClick={openCamera}>
                    다시 찍기
                  </button>
                )}
                <button className="btn ghost" type="button" onClick={spin}>
                  다시 돌리기
                </button>
              </div>

              {camError && (
                <p className="roulette-error">
                  {camError}{' '}
                  <label className="roulette-file">
                    사진 파일로 올리기
                    <input type="file" accept="image/*" capture="environment" onChange={onFile} />
                  </label>
                </p>
              )}

              {stage === 'shot' && (
                <p className="roulette-note">
                  모모고에서는 이렇게 하루 한 장이 그룹에 남습니다.{' '}
                  <button className="roulette-link" type="button" onClick={reset}>
                    처음부터
                  </button>
                </p>
              )}
            </>
          )}

          {stage === 'camera' && (
            <>
              <h1>{menu?.name} 한 장</h1>
              <div className="roulette-photo">
                {/* playsInline이 없으면 iOS에서 전체 화면으로 튀어 나갑니다 */}
                <video
                  ref={videoRef}
                  className={mirrored ? 'is-mirrored' : undefined}
                  autoPlay
                  muted
                  playsInline
                />
              </div>
              <div className="roulette-actions">
                <button className="btn" type="button" onClick={shoot}>
                  찰칵
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    stopCamera()
                    setStage('picked')
                  }}
                >
                  취소
                </button>
              </div>
            </>
          )}

          {/* 출처는 Unsplash 사진이 화면에 있을 때만 — 직접 찍은 사진에는 붙지 않습니다 */}
          {stage === 'picked' && <p className="roulette-note">음식 사진 출처 · Unsplash</p>}

          <canvas ref={canvasRef} className="roulette-canvas" />
        </section>
      </main>
    </Layout>
  )
}
