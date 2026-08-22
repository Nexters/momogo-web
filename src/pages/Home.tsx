import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../Layout'

export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target) // 한 번 나타나면 다시 감추지 않습니다
        }
      },
      { threshold: 0.15 },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <Layout title="모모고 — 오늘 한 장, 우리끼리">
      <main>
        <section className="hero wrap">
          <img className="icon" src="/assets/icon.png" alt="모모고 앱 아이콘" />
          <h1>오늘 한 장, 우리끼리</h1>
          <p>
            하루에 한 장이면 충분합니다. 초대한 사람들끼리만 모여 오늘의 사진을
            남기고, 서로의 하루에 반응해 보세요.
          </p>
          <div className="stores">
            <a
              className="btn"
              href="https://apps.apple.com/kr/app/%EB%AA%A8%EB%AA%A8%EA%B3%A0/id6801859996"
              target="_blank"
              rel="noreferrer"
            >
              App Store
            </a>
            {/* TODO: Google Play 출시 후 href 연결하고 aria-disabled 제거 */}
            <a className="btn ghost" href="#" aria-disabled="true">
              Google Play · 준비 중
            </a>
          </div>
          <p className="hero-demo">
            <Link to="/lunch">점심 룰렛 해보기 →</Link>
          </p>
        </section>

        <section className="features wrap">
          <article className="card" data-reveal>
            <span className="dot" style={{ background: 'var(--primary-500)' }} />
            <h3>하루 한 장</h3>
            <p>
              그룹마다 하루에 사진 한 장만 올릴 수 있습니다. 많이 올리는 대신,
              오늘 가장 남기고 싶은 순간을 고르게 됩니다.
            </p>
          </article>
          <article className="card" data-reveal>
            <span className="dot" style={{ background: 'var(--point-1)' }} />
            <h3>초대한 사람만</h3>
            <p>
              초대 코드를 받은 사람만 그룹에 들어옵니다. 팔로워도, 알고리즘도
              없이 아는 사람들끼리만 봅니다.
            </p>
          </article>
          <article className="card" data-reveal>
            <span className="dot" style={{ background: 'var(--point-2)' }} />
            <h3>가볍게 반응</h3>
            <p>
              긴 댓글 대신 반응 하나로 충분합니다. 부담 없이 서로의 하루를
              확인합니다.
            </p>
          </article>
        </section>
      </main>
    </Layout>
  )
}
