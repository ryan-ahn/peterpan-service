---
paths:
  - "packages/ui/**"
  - "packages/tailwind-config/**"
---

# packages/ui

`packages/ui/` 작업 시 `packages/ui/CONVENTIONS.md`를 따른다.

- 두 앱 공통 원자만. 도메인 상태·데이터 로딩·라우팅·`next` 의존 금지.
- 토큰은 `@repo/tailwind-config`의 등록 이름만. `tv` + `cn`.
- barrel re-export 금지. import는 `@repo/ui/components/*` 등 exports 경로.
