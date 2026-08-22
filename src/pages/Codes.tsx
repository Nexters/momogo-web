import { useEffect, useRef, useState } from 'react'
import Layout from '../Layout'

type Team = { name: string; code: string }

/**
 * 부스에서 띄워 두는 팀별 그룹 참여 코드판.
 *
 * 방문자가 모니터에서 코드를 보고 앱에 입력하는 것이 기본 흐름이라, 코드를 크게 쓰고
 * 자간을 벌려 한 글자씩 또박또박 읽히게 했습니다. 휴대폰으로 이 페이지를 열었을 때를
 * 위해 코드를 누르면 복사도 됩니다.
 */
const TEAMS: Team[] = [
  { name: '하이드레이션 타임', code: 'V9J5PW' },
  { name: '사자 보이즈', code: 'V6YSYG' },
  { name: '뽀또이쯤', code: 'MBOBNX' },
  { name: 'GAMSS', code: 'TOMNXF' },
  { name: '취급주의 - 인간 사용 설명서', code: 'S99OG4' },
  { name: '여백이들의 교환독서', code: '357MLU' },
  { name: '프렙', code: '53E3TU' },
  { name: 'nook', code: 'ZUOJDL' },
]

export default function Codes() {
  const [copied, setCopied] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  async function copy(code: string) {
    if (timer.current) clearTimeout(timer.current)
    try {
      // clipboard는 HTTPS(또는 localhost)에서만 동작합니다
      await navigator.clipboard.writeText(code)
      setFailed(false)
      setCopied(code)
      timer.current = window.setTimeout(() => setCopied(null), 1600)
    } catch {
      setCopied(null)
      setFailed(true)
    }
  }

  return (
    <Layout title="그룹 참여 코드 — 모모고">
      <main>
        <section className="codes wrap">
          <h1>그룹 참여 코드</h1>
          <p className="codes-lead">
            모모고 앱에서 참여할 그룹의 코드를 입력하면 들어갈 수 있습니다.
          </p>

          <ul className="codes-list">
            {TEAMS.map((t) => (
              <li className="card code-card" key={t.code}>
                <span className="code-team">{t.name}</span>
                <button
                  className={copied === t.code ? 'code-value is-copied' : 'code-value'}
                  type="button"
                  onClick={() => copy(t.code)}
                  aria-label={`${t.name} 참여 코드 ${t.code.split('').join(' ')} 복사`}
                >
                  {t.code}
                </button>
              </li>
            ))}
          </ul>

          {/* 복사 결과는 화면에도 보이고 스크린리더에도 읽힙니다 */}
          <p className="codes-note" role="status">
            {copied && `${copied} 복사했습니다.`}
            {!copied && failed && '복사가 안 됩니다. 코드를 직접 입력해 주세요.'}
            {!copied && !failed && '코드를 누르면 복사됩니다.'}
          </p>
        </section>
      </main>
    </Layout>
  )
}
