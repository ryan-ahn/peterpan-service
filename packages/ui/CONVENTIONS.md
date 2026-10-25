# packages/ui 작성 규칙

공용 디자인 시스템 (`@repo/ui`). 루트 [`CONVENTIONS.md`](../../CONVENTIONS.md)의 스타일·가독성 원칙을 따른다.

---

## 역할

- 웹사이트와 어드민이 함께 쓰는 DS 원자만 둔다. props로 모양·문구·`on*` 콜백을 받는다.
- 도메인 상태·데이터 로딩·라우팅은 두지 않는다. `next`에도 의존하지 않는다. 앱 로직은 `apps/*`에 둔다.
- 어드민 셸·표처럼 한 앱에서만 쓰는 조합은 그 앱 `components/`에 둔다.

---

## 구조

```
packages/ui/src/
  components/   # button, chip, input, textarea, checkbox, radioGroup, toggle, select,
                # tab, pagination, carousel, modal, bottomSheet, toast, tooltip,
                # spinner, skeleton, divider, avatar
  hooks/        # useOverlay (ESC 닫기·스크롤 잠금)
  text/         # Text
  icon/         # Icon
  lib/cn.ts
  lib/tv.ts
  lib/twMergeConfig.ts
```

- 패키지 `exports`에 맞춰 import: `@repo/ui/components/button`, `@repo/ui/hooks/useOverlay`, `@repo/ui/text`, `@repo/ui/icon`, `@repo/ui/lib/cn`, `@repo/ui/lib/tv`.
- barrel `index.ts`로 전부 re-export하지 않는다.
- 패키지 안에서는 상대 경로로 가져온다 (`../lib/cn`). 앱 별칭은 쓰지 않는다.

---

## 스타일

- 토큰: `packages/tailwind-config/tokens.css`. JS 색: `@repo/tailwind-config/theme`.
- 등록한 토큰 이름만 쓴다. 임의 값(`text-[13px]`, `#fff`)을 쓰지 않는다.
- variant 묶음은 `./lib/tv`, 클래스 병합은 `./lib/cn`. 둘 다 `twMergeConfig`로 숫자 글자 크기(`text-5`)를 색과 구분한다.
- 앱 `globals.css`의 `@source "../../../packages/ui/src"`가 이 패키지 클래스를 스캔한다. 새 앱을 만들면 같은 줄을 넣는다.

---

## 컴포넌트

- `"use client"`는 상태·이펙트·브라우저 API가 있는 파일만.
- 외부에 넘기는 유니온 타입(`Variant`, `Color`, `Size`, `Name`, `Option`)만 export. `Props`는 파일 안에 둔다. 앱에서는 `import type { Variant as TextVariant }`처럼 별칭으로 가져온다.
- 컴포넌트는 default export. `toast`처럼 훅을 같이 내보낼 때만 named export를 더한다 (`useToast`).
- 파일명 camelCase (`bottomSheet.tsx`), 컴포넌트 PascalCase (`BottomSheet`).
- 선언 위 JSDoc에 역할과 `@param`을 적는다.

### props 이름

| 의미        | 이름                                                         |
| ----------- | ------------------------------------------------------------ |
| 모양        | `variant`, `color`, `size`                                   |
| 문구        | `text`, `label`, `title`, `description`, `helperText`        |
| 상태        | `isOpen`, `isDisabled`, `isLoading`, `isSelected` 등         |
| 보조 영역   | `leftChildren`, `rightChildren`, `footer`                    |
| 값 변경     | `value` + `onChange(nextValue)`. 이벤트 객체를 넘기지 않는다 |
| 닫기·누르기 | `onClose`, `onClick`, `onEnter`                              |

- 크기 이름은 `xsmall`, `small`, `medium`, `large`.
- `Text`의 글자색은 `color` prop(인라인 CSS 색)이다. `className`의 색 유틸은 인라인 색에 가려진다.
- 오버레이(`Modal`, `BottomSheet`)는 `createPortal`로 `body`에 그리고 `useOverlay`로 ESC·스크롤 잠금을 맞춘다.

### 색

| 컴포넌트 | `color`                                                                                      |
| -------- | -------------------------------------------------------------------------------------------- |
| `Button` | 시스템 `primary`·`gray`·`black`·`danger`, 브랜드 `pine`·`gold`·`paper`·`white`, 외부 `kakao` |
| `Chip`   | `primary`·`gray`·`green`·`orange`·`red`·`gold`                                               |

- 어드민은 시스템 색, 웹사이트는 브랜드 색을 쓴다. `white`는 짙은 배경 위 버튼이다.
- `Button`의 클래스는 `buttonStyle`로도 내보낸다. 앱에서 `next/link`를 버튼 모양으로 그릴 때 `className={buttonStyle({ variant, color, size })}`로 쓴다.
