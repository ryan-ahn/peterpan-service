# 작성 규칙

피터팬 재단 웹. Next.js App Router, React, CSS Modules.

상세는 루트 `CONVENTIONS.md`, 실행·빌드는 `README.md`.

영역별 규칙은 해당 경로를 열 때 `.claude/rules/`가 붙는다.

| 경로          | 규칙                          |
| ------------- | ----------------------------- |
| `app/`        | `.claude/rules/app.md`        |
| `components/` | `.claude/rules/components.md` |
| `hooks/`      | `.claude/rules/hooks.md`      |
| `utils/`      | `.claude/rules/utils.md`      |
| `types/`      | `.claude/rules/types.md`      |

## 원칙

- 의존성 최소화. 쓰는 파일에 두고, 두 파일 이상일 때만 분리한다.
- 단일 책임. 이름만 봐도 역할이 드러나게 짓는다.
- 가독성 우선. 리렌더를 따라가기 어려울 때만 메모이제이션한다.
- 페이지 본문 섹션은 그 `page.tsx` 안에 둔다.

## 경로

- 다른 폴더의 코드는 `tsconfig.json` 별칭으로 가져온다. `@app/*`, `@assets/*`, `@components/*`, `@constants/*`, `@hooks/*`, `@theme/*`, `@utils/*`.
- `paths` 대상은 `./`로 시작한다. `baseUrl`은 쓰지 않는다.
- 상대 경로는 같은 폴더의 CSS 모듈만.
- `types/`는 `import type`만.

## import

`"use client"`가 필요하면 파일 첫 줄. 이어서 `react`·`next`, 별칭, CSS 모듈. 그룹 사이 빈 줄.

## 파일 블록

없는 블록은 주석도 선언도 두지 않는다.

```
imports → /** constants */ → /** types */ → /** actions */ → /** pre-root runtime */ → /** pre-root utils */ → /** hooks */ → /** screen */ → /** section */ → /** inner components */ → /** utils */ → export default
```

- 파일 레벨 주석은 JSDoc 여러 줄. 첫 줄은 구역 이름(`screen — 역할`). 컴포넌트 내부만 `// hooks`, `// render`.
- `pre-root runtime`은 screen이 기다리는 `read*`. `utils`는 screen이 직접 부르지 않는 헬퍼이며 inner 다음, `export default` 직전.
- 라우트 파일은 `page.tsx`, `layout.tsx`. 페이지 컴포넌트 이름만 `*Screen`.
- `export default`는 파일 맨 아래. `layout.tsx`만 `metadata`와 `export default function RootLayout`.

## 컴포넌트 내부

필요한 블록만 이 순서로. 블록 사이 빈 줄 없음. 함수 본문 안 빈 줄 없음.

1. `// hooks`
2. `// refs` — 렌더 중 `ref.current` 접근 금지
3. `// states`
4. `// variables`
5. `// functions`
6. `// handlers`
7. `// effects`
8. `// render`

스타일은 `*.module.css`다. 컴포넌트 안에 스타일 객체를 두지 않는다.

## 서버와 클라이언트

- 페이지는 서버 컴포넌트가 기본. 필요하면 `async`.
- 상태·이펙트·브라우저 API가 있는 파일만 `"use client"`.
- 캐시할 데이터 로딩은 `read*` 안에서 `"use cache"`와 `cacheLife`.

## 스타일

- 반복 색·글꼴·헤더 높이는 `app/globals.css`의 `:root`.
- 글꼴은 `app/layout.tsx`의 `next/font`.
- 클래스 이름은 camelCase. 배치는 `flex`, `grid`, `gap`.
- 글자는 `Text`의 `variant`·`color`, 버튼은 `Button`의 `variant`·`size`.
- 로컬 이미지는 `@assets`와 `next/image`.

## 링크

- 페이지 안 이동은 `<a href="#id">`.
- 다른 라우트는 `next/link`.
- 바깥 주소는 `<a target="_blank" rel="noreferrer">`.

## 네이밍

- 파일·폴더 camelCase. 컴포넌트 PascalCase. `*Screen`, `*Section`.
- 이미지 kebab-case.
- 핸들러는 `handle` + 대상 + 동작.

## 조건식과 함수

- `else` 없이 early return. JSX의 짧은 분기는 삼항.
- 컴포넌트는 `Props`를 파라미터에서 분해한다.
- 유틸·훅은 파라미터 객체에 타입 이름을 붙이고, 분해는 함수 안에서 한다.
