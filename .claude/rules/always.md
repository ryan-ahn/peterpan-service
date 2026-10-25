# 작성 규칙

피터팬 재단 Turborepo 모노레포. 상세는 루트 `CONVENTIONS.md`, 실행·빌드는 `README.md`.

영역별 상세는 해당 경로를 열 때 `.claude/rules/` glob 규칙이 붙는다. 원문은 각 디렉터리의 `CONVENTIONS.md`가 기준이다.

| 경로                         | 문서                                       |
| ---------------------------- | ------------------------------------------ |
| `apps/peterpan-website/app/` | `apps/peterpan-website/app/CONVENTIONS.md` |
| `apps/peterpan-admin/app/`   | `apps/peterpan-admin/app/CONVENTIONS.md`   |
| `packages/ui/`               | `packages/ui/CONVENTIONS.md`               |

## 원칙

- 의존성 최소화: 사용처에 두고, 두 곳 이상 쓸 때만 분리.
- 단일 책임·가독성 우선. 작업 후 루트에서 `npm run check`.

## 컴포넌트 위치

- 두 앱 공통 원자: `packages/ui`. 어드민 여러 화면: `apps/peterpan-admin/components`. 웹사이트 여러 화면: `apps/peterpan-website/components`. 한 화면만: 그 `page.tsx`.

## 경로

- 앱: `@/*`, `@app/*`, `@components/*`, `@lib/*`. 웹사이트 `@assets/*`, 어드민 `@constants/*`.
- 공유: `@repo/ui/...`, `@repo/tailwind-config`, `@repo/db/...`(DB·게시판 상수), `@repo/auth/...`(Supabase·세션·OAuth). 타입 프리셋 `@repo/typescript-config`.
- 환경 변수는 루트 `.env` 하나.
- 타입만 가져올 때 `import type`.

## 파일 블록

```
imports → constants → types → actions → pre-root runtime → pre-root utils → hooks → screen → section → inner → utils → export default
```

- 페이지 컴포넌트 `*Screen`. JSDoc 파일 블록, 내부 `// hooks` … `// render`. 블록 사이·함수 본문 안 빈 줄 없음.

## 스타일

- 토큰은 `packages/tailwind-config/tokens.css`의 등록 이름만. 간격 4px, 글자 2px 번호. 모바일 기본.
- `cn`·`tv`는 `@repo/ui/lib`. 임의 hex·px 금지.

## 네이밍·조건식

- 핸들러 `handle[대상][동작]`, boolean `is*`/`has*`. `else` 없이 early return.
