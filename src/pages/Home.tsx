import Layout from '../Layout'

/**
 * 앱 소개 스크린샷.
 * public/assets/screenshots/ 에 파일을 넣고 여기에 한 줄씩 추가하면 렌더됩니다.
 * 비어 있으면 섹션 자체가 표시되지 않습니다.
 */
const SHOTS: { src: string; caption: string }[] = [
  // { src: '/assets/screenshots/01-today.png', caption: '오늘의 한 장' },
  // { src: '/assets/screenshots/02-group.png', caption: '초대한 사람들끼리' },
  // { src: '/assets/screenshots/03-react.png', caption: '가볍게 반응' },
]

export default function Home() {
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
            {/* TODO: 스토어 출시 후 href 연결하고 aria-disabled 제거 */}
            <a className="btn" href="#" aria-disabled="true">
              App Store · 준비 중
            </a>
            <a className="btn ghost" href="#" aria-disabled="true">
              Google Play · 준비 중
            </a>
          </div>
        </section>

        <section className="features wrap">
          <article className="card">
            <span className="dot" style={{ background: 'var(--primary-500)' }} />
            <h3>하루 한 장</h3>
            <p>
              그룹마다 하루에 사진 한 장만 올릴 수 있습니다. 많이 올리는 대신,
              오늘 가장 남기고 싶은 순간을 고르게 됩니다.
            </p>
          </article>
          <article className="card">
            <span className="dot" style={{ background: 'var(--point-1)' }} />
            <h3>초대한 사람만</h3>
            <p>
              초대 코드를 받은 사람만 그룹에 들어옵니다. 팔로워도, 알고리즘도
              없이 아는 사람들끼리만 봅니다.
            </p>
          </article>
          <article className="card">
            <span className="dot" style={{ background: 'var(--point-2)' }} />
            <h3>가볍게 반응</h3>
            <p>
              긴 댓글 대신 반응 하나로 충분합니다. 부담 없이 서로의 하루를
              확인합니다.
            </p>
          </article>
        </section>

        {SHOTS.length > 0 && (
          <section className="shots">
            <h2>이렇게 생겼습니다</h2>
            <ul className="shots-track">
              {SHOTS.map((shot) => (
                <li key={shot.src}>
                  <img src={shot.src} alt={shot.caption} loading="lazy" />
                  <span>{shot.caption}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </Layout>
  )
}
