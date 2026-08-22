import { QRCodeSVG } from 'qrcode.react'
import Layout from '../Layout'

/**
 * 부스용 QR 페이지. 노트북·태블릿을 세워 두고 방문자가 스캔하게 만든 화면입니다.
 *
 * QR에 담기는 주소는 이 페이지를 열어 준 도메인(`origin`)입니다. 프로덕션에서 열면
 * 프로덕션 주소, 로컬에서 열면 로컬 주소가 담기므로 개발 중 휴대폰 테스트도 그대로 됩니다.
 * 정식 도메인이 정해지면 아래 `CANONICAL`에 적어 고정하세요.
 */
const CANONICAL = '' // 예: 'https://momogo.app'

function siteUrl() {
  if (CANONICAL) return CANONICAL
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export default function Qr() {
  const url = siteUrl()

  return (
    <Layout title="모모고 QR — 스캔해서 열어보세요">
      <main>
        <section className="qr wrap">
          <h1>휴대폰으로 스캔하세요</h1>
          <p className="qr-lead">카메라를 켜고 아래 코드를 비추면 모모고 소개 페이지가 열립니다.</p>

          <div className="qr-frame">
            {/* 색은 --gray-1 / --white 토큰 값. SVG fill은 CSS 변수를 받지 못해 직접 씁니다 */}
            <QRCodeSVG
              value={url}
              size={512}
              level="M"
              marginSize={2}
              fgColor="#171719"
              bgColor="#ffffff"
              title="모모고 소개 페이지 QR 코드"
            />
          </div>

          <p className="qr-url">{url.replace(/^https?:\/\//, '')}</p>
        </section>
      </main>
    </Layout>
  )
}
