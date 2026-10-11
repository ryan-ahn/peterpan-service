# 코드 작성 규칙

피터팬 재단 웹. Next.js App Router, React, CSS Modules.

실행·빌드는 [`README.md`](README.md).

---

## 원칙

- **의존성 최소화.** 타입·헬퍼·UI는 쓰는 파일에 둔다. 두 파일 이상에서 쓸 때만 `components/`, `hooks/`, `utils/`, `types/`, `constants/`로 올린다.
- **단일 책임.** 한 파일·한 함수는 한 가지 역할. 이름만 봐도 역할이 드러나게 짓는다.
- **가독성 우선.** 읽기 쉬운 코드를 먼저 둔다. 리렌더가 화면을 따라가기 어려울 때만 메모이제이션을 넣는다.
- **불필요한 분리 금지.** 만들 수 있다는 이유만으로 파일·컴포넌트·훅을 나누지 않는다. 페이지 본문 섹션은 그 `page.tsx` 안에 둔다.

---

## 디렉터리

| 경로                                    | 역할                                                                              |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| `app/`                                  | 라우트. `layout.tsx`, `page.tsx`, `globals.css`, 페이지 CSS 모듈                  |
| `components/`                           | 여러 곳에서 쓰는 UI, 그리고 자체 상태·스타일을 가진 헤더. 파일마다 `*.module.css` |
| `assets/`                               | `next/image`로 가져오는 이미지                                                    |
| `hooks/` `utils/` `types/` `constants/` | 두 파일 이상에서 공유할 때만 만든다                                               |

경로 별칭은 `tsconfig.json`의 `paths`다. `baseUrl` 없이 쓰므로 대상 경로는 `./`로 시작한다.

| 별칭            | 디렉터리      |
| --------------- | ------------- |
| `@/*`           | 프로젝트 루트 |
| `@app/*`        | `app/`        |
| `@assets/*`     | `assets/`     |
| `@components/*` | `components/` |
| `@constants/*`  | `constants/`  |
| `@hooks/*`      | `hooks/`      |
| `@theme/*`      | `theme/`      |
| `@utils/*`      | `utils/`      |

- 다른 폴더의 코드는 별칭으로 가져온다. 상대 경로는 같은 폴더의 CSS 모듈에만 쓴다.
- `types/`에서 가져올 때는 `import type`만 쓴다.

---

## import

파일 첫 줄에 `"use client"`가 필요하면 그것만 두고, 아래 순서로 가져온다. 그룹 사이에는 빈 줄을 둔다.

1. `react`, `next`
2. `@assets`, `@components`, `@app`, `@constants`, `@hooks`, `@utils`
3. 같은 폴더의 `*.module.css`

```tsx
"use client";

import { useState } from "react";

import Button from "@components/button";

import styles from "./siteHeader.module.css";
```

---

## 컴포넌트 파일

`const`는 호이스팅되지 않는다. 아래는 파일 위→아래 선언 순서다. 없는 블록은 주석도 선언도 두지 않는다.

```
imports
→ /** constants */
→ /** types */
→ /** actions */
→ /** pre-root runtime */
→ /** pre-root utils */
→ /** hooks */
→ /** screen */
→ /** section */
→ /** inner components */
→ /** utils */
→ export default
```

| 블록               | 내용                                                                             |
| ------------------ | -------------------------------------------------------------------------------- |
| `constants`        | 그 파일에서만 쓰는 상수                                                          |
| `types`            | 그 파일에서만 쓰는 타입. 컴포넌트 props는 `type Props`                           |
| `actions`          | 여러 컴포넌트가 공유하는 side effect. 가능하면 컴포넌트 `handlers`에 둔다        |
| `pre-root runtime` | screen이 직접 기다리는 데이터 로딩. 순수 함수가 아님. `read*`                    |
| `pre-root utils`   | screen·훅이 부르는 순수 함수                                                     |
| `hooks`            | 그 파일의 컴포넌트가 공유하는 훅. 한 컴포넌트만 쓰면 그 안의 `// hooks`          |
| `screen`           | 페이지 진입점 하나. 섹션 조합과 페이지 단위 데이터                               |
| `section`          | 본문 큰 단위 `*Section`. screen 바로 아래                                        |
| `inner components` | 섹션보다 작은 UI. 같은 파일에서 두 곳 이상 쓸 때만 분리하고, section 다음에 둔다 |
| `utils`            | screen이 직접 부르지 않는 헬퍼. inner 다음, `export default` 직전                |

- 파일 레벨 구역은 JSDoc 여러 줄이다. 첫 줄은 구역 이름이다. `/** screen — 역할 */`, `/** pre-root runtime */`처럼 쓴다. 한 줄 `/** hooks */`는 쓰지 않는다.
- 라우트 파일 이름은 Next 규약대로 `page.tsx`, `layout.tsx`다. 그 안의 페이지 컴포넌트 이름만 `*Screen`이다.
- 선언과 default export는 분리한다. `export default`는 파일 맨 아래다.
- `app/layout.tsx`는 Next 규약대로 `metadata` named export와 `export default function RootLayout`을 둔다.
- 재사용 컴포넌트는 선언 위에 역할과 `@param`을 적는다. screen 블록 주석이 있는 페이지 컴포넌트에는 JSDoc을 한 번 더 달지 않는다.
- 외부에 넘기는 유니온(`Variant`, `Size`, `Color`, `Name`)만 export한다. `Props`는 파일 안에 둔다.

```tsx
/**
 * screen — 피터팬 재단 홈
 */
const HomeScreen = async () => {
  // variables
  const brunch = await readHomeBrunch();
  // render
  return ( ... );
};

/**
 * section
 */
const HeroSection = () => { ... };

/**
 * inner components
 */
const StoryPolaroid = ({ story }: { story: BrunchCard }) => { ... };

/**
 * utils
 * screen이 직접 부르지 않는 헬퍼.
 */
const toCard = (article: BrunchArticleRaw): BrunchCard | null => { ... };

export default HomeScreen;
```

---

## 컴포넌트 내부

함수 컴포넌트 본문은 `//` 한 줄 주석만 쓴다. 필요한 블록만 아래 순서로 둔다.

1. `// hooks` — 커스텀 훅, `useMemo`. 이벤트용 `useCallback`은 `// handlers`
2. `// refs` — `useRef`. 렌더 중에 `ref.current`를 읽거나 쓰지 않는다
3. `// states` — `useState`
4. `// variables` — 렌더에 쓰는 파생 값
5. `// functions` — 이벤트에 묶이지 않는 순수 함수
6. `// handlers` — `handle` + 대상 + 동작
7. `// effects` — `useEffect`
8. `// render` — JSX와 early return

`// fetch`, `// routes`처럼 목록 밖 이름은 만들지 않는다. 스타일은 CSS 모듈이므로 컴포넌트 안에 스타일 블록을 두지 않는다.

- 블록 주석 바로 다음에 코드를 둔다. 주석과 코드 사이, 블록과 블록 사이에 빈 줄을 넣지 않는다.
- 같은 블록의 함수도 빈 줄 없이 이어 쓴다.
- 함수 본문 안에도 문장 사이 빈 줄을 넣지 않는다.

---

## 서버와 클라이언트

- 페이지와 레이아웃은 서버 컴포넌트가 기본이다. 데이터가 필요하면 컴포넌트를 `async`로 둔다.
- 상태, 이펙트, 브라우저 API가 있는 컴포넌트만 파일 첫 줄에 `"use client"`를 둔다.
- screen이 기다리는 로딩은 `/** pre-root runtime */`의 `read*`에 둔다. 캐시할 때는 그 함수 안에서 `"use cache"`와 `cacheLife`를 쓴다.
- 목록을 나누고 날짜를 맞추는 작업은 screen이 직접 부르지 않으면 `/** utils */`에 둔다.

---

## 링크

- 페이지 안 이동은 섹션 `id`로 연결하는 `<a href="#...">`다.
- 앱 안의 다른 라우트로 이동할 때는 `next/link`를 쓴다.
- 바깥 주소는 `<a target="_blank" rel="noreferrer">`다.

---

## 스타일

- 반복되는 색, 글꼴, 헤더 높이는 `app/globals.css`의 `:root` 변수다. `--ink`, `--gold`, `--font-sans`, `--header-height`.
- 글꼴 파일은 `app/layout.tsx`의 `next/font`로 불러 CSS 변수에 연결한다.
- 컴포넌트·페이지 스타일은 같은 이름의 `*.module.css`다. 클래스 이름은 camelCase다.
- 배치는 `flex`, `grid`, `gap`으로 잡는다. 박스 안쪽 여백은 `padding`, 가운데 정렬 너비는 `margin-inline: auto`다.
- 글자 모양은 `Text`의 `variant`·`color`, 버튼 모양은 `Button`의 `variant`·`size`로 고른다.
- 로컬 이미지는 `@assets`에서 가져와 `next/image`에 넘긴다.
- 원격 이미지는 `next.config.ts`의 `images.remotePatterns`에 호스트를 추가한 뒤 `next/image`로 쓴다.

```tsx
<Text as="h1" variant="display" color="white">
  어른이 되어서도, 꿈을 잃지 않도록.
</Text>
```

---

## 네이밍

- **파일·폴더:** camelCase. `siteHeader.tsx`, `home.module.css`. 라우트 그룹만 `(group)` 형태.
- **라우트 파일:** `page.tsx`, `layout.tsx`.
- **컴포넌트:** PascalCase. 페이지는 `*Screen`, 본문 단위는 `*Section`. `HomeScreen`, `HeroSection`, `SiteHeader`.
- **이미지:** kebab-case, 용도가 드러나게. `section-1.png`, `section-4-flower.png`.
- **핸들러:** `handle` + 대상 + 동작. `handleMenuToggle`, `handleNavClick`.

---

## 조건식

`else` 없이 early return으로 걸러 낸다. JSX의 짧은 분기는 삼항을 쓴다.

```ts
const toCard = (article: BrunchArticleRaw): BrunchCard | null => {
  const title = article.title?.trim() ?? "";
  if (!article.no || !title) {
    return null;
  }
  return { id: article.no, title };
};
```

---

## 함수

- 컴포넌트는 `Props`를 파라미터에 붙이고, 그 자리에서 분해한다.
- 유틸과 훅은 파라미터 객체에 타입 이름을 붙이고, 분해는 함수 안에서 한다.

```ts
const Button = ({ variant, text }: Props) => { ... };

type FormatPublishDateParams = { publishTime: number };

const formatPublishDate = (params: FormatPublishDateParams): string => {
  const { publishTime } = params;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
    new Date(publishTime),
  );
};
```
