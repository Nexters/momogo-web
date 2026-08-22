# momogo-web

모모고 소개 및 약관 페이지. React + Vite SPA입니다.

```text
index.html            Vite 엔트리 (title·OG 메타)
vercel.json           SPA fallback rewrite
src/main.tsx          진입점
src/App.tsx           라우트 정의
src/Layout.tsx        헤더·푸터·document.title 공유
src/style.css         디자인 토큰 + 스타일
src/pages/            Home · Terms · Privacy · Qr
public/assets/        Figma에서 내려받은 로고·아이콘
```

| 경로 | 페이지 |
| --- | --- |
| `/` | 소개 |
| `/terms` | 이용약관 |
| `/privacy` | 개인정보처리방침 |
| `/qr` | 부스용 QR (홈 주소를 QR로 표시) |

## 로컬 확인

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # 타입체크 + dist/ 생성
npm run preview    # 빌드 결과 확인
```

## 배포

Vercel Git 연동. `main`에 push하면 자동 배포됩니다.

최초 설정은 [vercel.com/new](https://vercel.com/new) → 저장소 Import → Deploy. Framework Preset은 Vercel이 `Vite`로 자동 감지하므로 빌드 설정을 건드릴 필요가 없습니다.

`vercel.json`의 rewrite는 `/terms` 같은 경로로 직접 접속했을 때 404가 나지 않도록 하는 SPA fallback입니다. 앱스토어 심사에 개인정보처리방침 URL을 제출하려면 이게 있어야 합니다.

## 부스용 QR

`/qr`은 행사 부스에서 노트북·태블릿을 세워 두고 방문자가 스캔하게 만든 화면입니다.
헤더·푸터 내비게이션에는 넣지 않았습니다 — 주소를 직접 입력해 엽니다.

QR에 담기는 주소는 **그 페이지를 열어 준 도메인**(`window.location.origin`)입니다.
프로덕션에서 열면 프로덕션 주소, 로컬에서 열면 로컬 주소가 담기므로 개발 중 휴대폰
테스트도 그대로 됩니다. 정식 도메인이 정해지면 `src/pages/Qr.tsx`의 `CANONICAL`에
적어 고정하세요.

## 남은 작업

- `src/pages/Home.tsx`의 Google Play 링크 (출시 후 `aria-disabled` 제거)
- 약관 두 문서 법률 검토

## 디자인

[Figma — [모모고] DESIGN](https://www.figma.com/design/NdIwdVDLMja8p9G69g6PtZ/-%EB%AA%A8%EB%AA%A8%EA%B3%A0--DESIGN?node-id=1-21)

| 토큰 | 값 |
| --- | --- |
| Primary | `#FFCC42` |
| Point | `#00BCCB`, `#FF7583`, `#414040` |
| Font | Wanted Sans (jsDelivr CDN) |
