import { useEffect, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'

type Props = {
  title: string
  children: ReactNode
}

/** 헤더·푸터와 document.title을 모든 페이지가 공유합니다. */
export default function Layout({ title, children }: Props) {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <Link className="logo" to="/">
            <img className="mark" src="/assets/icon-small.png" alt="" />
            <img src="/assets/logotype.svg" alt="모모고" />
          </Link>
          <nav className="nav">
            {/* NavLink가 현재 경로에 aria-current="page"를 붙여줍니다 */}
            {/* 부스 모니터용이라 좁은 화면에서는 감춥니다 (style.css의 720px 블록).
                좁은 화면에서는 푸터 링크로 들어갑니다 */}
            <NavLink className="nav-booth" to="/codes">
              참여 코드
            </NavLink>
            <NavLink className="nav-booth" to="/lunch">
              점심 룰렛
            </NavLink>
            <NavLink to="/terms">이용약관</NavLink>
            <NavLink to="/privacy">개인정보처리방침</NavLink>
          </nav>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="wrap">
          <span>© 2026 모모고</span>
          <span>
            <Link to="/">홈</Link> · <Link to="/codes">참여 코드</Link> ·{' '}
            <Link to="/terms">이용약관</Link> ·{' '}
            <Link to="/privacy">개인정보처리방침</Link>
          </span>
        </div>
      </footer>
    </>
  )
}
