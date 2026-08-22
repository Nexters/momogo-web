# 모모고 웹

모모고 앱 소개 사이트. Vite + React 19 + react-router-dom, 페이지 5면(홈 / 이용약관 /
개인정보처리방침 / 부스용 QR `/qr` / 부스 시연용 점심 룰렛 `/lunch`).
Vercel 배포(`vercel.json`의 rewrite로 SPA 라우팅 처리).

```bash
npm run dev      # 로컬 개발
npm run build    # tsc --noEmit 후 vite build
npm run preview  # 빌드 결과 확인
```

---

# 디자인 시스템

원본은 Figma `[모모고] DESIGN`, 구현은 **`src/style.css` 한 장**입니다.
값은 사람이 옮겨 적으므로, Figma에 없는 색·크기를 코드에서 새로 만들지 않습니다.

## 원칙

- **색·모서리는 반드시 토큰으로.** 새 hex를 스타일시트에 직접 쓰지 않습니다.
- **컴포넌트는 의미 별칭을 씁니다.** `--gray-1`이 아니라 `--text`. 원색 직접 참조는 토큰 정의부와
  카드의 점 색상(포인트 컬러를 의도적으로 드러내는 자리)에서만.
- **컴포넌트는 CSS 클래스로 존재하고, JSX는 클래스만 붙입니다.** 스타일이 필요하면
  `src/style.css`에 클래스를 추가하고, `style={{}}` 인라인은 쓰지 않습니다.
- **모션은 절제.** 새 애니메이션을 만들기 전에 기존 `[data-reveal]`을 재사용할 수 있는지 봅니다.

## 토큰 (`src/style.css` 4–30행)

| 분류 | 토큰 | 값 | 쓰는 곳 |
|---|---|---|---|
| 브랜드 | `--primary-500` | `#ffcc42` | 버튼 배경, 포커스 링, 첫 카드 점 |
| | `--primary-400` | `#ffd562` | 버튼 호버 **전용** |
| 포인트 | `--point-1` | `#00bccb` | 두 번째 카드 점 |
| | `--point-2` | `#ff7583` | 세 번째 카드 점 |
| | `--point-3` | `#414040` | 아직 미사용 |
| 중립 | `--gray-1` | `#171719` | 본문 글자 |
| | `--gray-2` | `#222729` | 약관·방침 본문 글자 |
| | `--gray-4` | `#6e777c` | 보조 글자 |
| | `--gray-5` | `#5e696e` | 아직 미사용 |
| | `--gray-9` | `#f7f9fa` | 카드·ghost 버튼 바닥 |
| | `--white` | `#ffffff` | 배경 |
| 모서리 | `--radius-sm` / `-md` / `-lg` / `-full` | 8 / 12 / 20 / 999px | 포커스 링·로고 / 미사용 / 카드 / 버튼·점 |
| 별칭 | `--text` `--text-sub` `--bg` `--bg-soft` | gray-1 / gray-4 / white / gray-9 | 컴포넌트가 참조하는 값 |
| | `--border` | `#e8ebee` | 별칭이지만 hex 직접 (원색 없음) |
| 폭 | `--max` | `960px` | `.wrap` 최대 폭 |

새 색이 필요해 보이면 먼저 **미사용 토큰 3개(`--point-3`, `--gray-5`, `--radius-md`)**를
쓸 자리인지 검토합니다.

## 타이포그래피

Wanted Sans Variable(jsdelivr CDN `@import`) → Pretendard → Apple SD Gothic Neo.
**자간 `-0.02em`은 제목·본문 모두 고정.** 제목 700 / 본문 500.

| 역할 | 크기 | 행간 |
|---|---|---|
| 히어로 h1 | 40px (≤720px에서 30px) | 1.35 |
| h1 / h2 / h3 | 32(→26) / 26 / 20px | 1.35 |
| 본문 | 17px | 1.5 |
| 약관·방침 본문 (`.doc p`, `.doc li`) | 16px | **1.75** |
| 캡션·표·푸터 | 14–15px | 1.6 |

한글 장문에서 1.5는 빡빡합니다. `.doc` 안에서만 1.75를 씁니다.

## 간격

간격 토큰은 **없습니다.** 여백은 직접 px로 쓰되 새 값을 만들지 말고 기존 값을 재사용합니다:
`8 · 10 · 12 · 13 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 32 · 40 · 44 · 48 · 56 · 72 · 80 · 96`.

고정 치수: 헤더 64px(≤720px 56px) · 버튼 52px · `.wrap` 좌우 여백 20px(≤720px에서 `.doc`만 22px) ·
`.roulette-photo` 760px ·
약관 문서 폭 760px · 반응형 전환점 **720px 하나**.

그림자는 두 개뿐입니다. 새로 만들지 않습니다.
`0 12px 32px rgba(23,23,25,.14)`(앱 아이콘) / `0 12px 28px rgba(23,23,25,.10)`(카드 호버).

## 컴포넌트

`.wrap`(폭·여백) · `.site-header` · `.nav` · `.btn`(+`.ghost`) · `.card`(+`.dot`) ·
`.doc`(약관 문서 타이포·표) · `.qr`(+`.qr-lead` `.qr-frame` `.qr-url`) ·
`.roulette`(+`-lead` `-board` `-chip` `-slot` `-photo` `-actions` `-note`) · `.site-footer`.
이 아홉 개로 사이트 전체를 만듭니다.

`.roulette`은 부스 시연용입니다. `.roulette-board`는 후보를 늘어놓은 판이고, 돌아가는 동안
`.roulette-chip.is-lit`이 칸을 옮겨 다닙니다 — 이 이동이 룰렛의 애니메이션입니다. 결과
사진은 방문자가 모니터를 찍는 용도라 760px(약관 문서와 같은 폭)까지 채웁니다.
룰렛으로 들어가는 곳은 헤더 `.nav`의 `점심 룰렛` 하나입니다.

`.qr`은 부스용 화면이라 등장 모션을 붙이지 않습니다 — 열자마자 스캔 가능해야 합니다.
`.qr-frame`의 배경은 스캔 안정성 때문에 `--bg`(흰색) 고정이고, 안쪽 여백 24px이 QR의
quiet zone 역할을 합니다. QR 자체의 색은 SVG `fill`이 CSS 변수를 받지 못해
`--gray-1`·`--white`의 값을 JSX에서 직접 씁니다(새 색이 아닙니다).

## 모션

- 등장: `[data-reveal]` + `Home.tsx`의 IntersectionObserver(threshold 0.15). 한 번 나타나면
  `unobserve` — 다시 감추지 않습니다.
- 값: `opacity .45s ease` + `transform .35s cubic-bezier(.2,.8,.3,1)`, `translateY(16px)`,
  카드 순차 지연 80ms / 160ms.
- 호버: `translateY(-4px)` + 그림자. 이때 `transition-delay: 0s`로 되돌려, 등장 지연이 호버까지
  늦추지 않게 합니다.
- **`@media (prefers-reduced-motion: reduce)` 블록에 새 모션도 반드시 추가합니다.** 단,
  그 블록은 모션 구역에 있어서 뒤에 오는 규칙(`.roulette` 등)을 덮지 못합니다 — 특이성이
  같으면 나중에 온 것이 이깁니다. 뒤쪽 구역의 모션은 그 구역 끝에 같은 미디어 블록을
  하나 더 두어 끕니다(`.roulette`이 그렇게 하고 있습니다).
- 룰렛(`/lunch`)이 메뉴 이름을 빠르게 바꾸는 것도 모션입니다. 이건 CSS가 아니라 상태
  변경이라 위 블록으로 막을 수 없어, `Lunch.tsx`가 `matchMedia`로 직접 확인해 건너뜁니다.
  JS로 움직이는 것을 새로 만들면 같은 검사를 넣으세요.

## 접근성·한글 기본값 (건드리지 말 것)

- 포커스 링은 `:focus-visible`에만. `--primary-500` 2px, offset 3px. 마우스 클릭에는 뜨지 않습니다.
- 현재 페이지 표시는 `NavLink`의 `aria-current="page"`, 색만 진해집니다(밑줄·배경 없음).
- 비활성 버튼은 `aria-disabled="true"` + `pointer-events: none` + opacity 0.45. `disabled` 대신.
- `.doc`에 `overflow-wrap: break-word` — 긴 이메일·URL이 좁은 화면을 밀어내지 않게.
- `html`에 `-webkit-text-size-adjust: 100%` — iOS 가로 모드에서 본문이 커지는 것 방지.
- 3열 이상 표는 `.table-scroll`로 감싸 최소 440px + 가로 스크롤. 2열 표는 감싸지 않습니다.

## 스타일시트 구조

`src/style.css`는 **토큰 → 리셋·요소 → 레이아웃(`.wrap`) → 헤더 → 히어로·버튼 →
기능 카드 → 모션 → 문서(`.doc`) → QR(`.qr`) → 룰렛(`.roulette`) → 푸터 →
`@media (max-width: 720px)`** 순서입니다.

`.wrap`을 같이 쓰는 섹션(`.hero` `.features` `.qr` `.roulette`)은 **`padding` 단축 속성을
쓰지 않고 `padding-top`/`padding-bottom`만 지정합니다.** 단축 속성을 쓰면 `.wrap`의 좌우
20px가 지워져 좁은 화면에서 본문이 화면 끝에 붙습니다. 이 순서를 유지합니다
(선택자 특이성이 낮아 순서가 곧 우선순위입니다).

## 아직 없는 것

- **다크 모드**: 의미 별칭 구조는 준비됐습니다. `prefers-color-scheme` 블록에서 별칭
  5개(`--text` `--text-sub` `--bg` `--bg-soft` `--border`)만 재정의하면 됩니다.
- **Figma ↔ 코드 자동 동기화**: 수동 복사이므로, 값이 어긋나도 감지되지 않습니다.
