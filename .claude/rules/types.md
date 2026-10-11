---
paths:
  - "types/**"
---

# types

두 파일 이상에서 쓰는 타입만 `types/`에 둔다. 상세는 루트 [`CONVENTIONS.md`](../../CONVENTIONS.md).

- 한 화면의 `Props`와 응답 형태는 그 파일의 `/** types */`에 둔다.
- 가져올 때는 `import type`만 쓴다.
