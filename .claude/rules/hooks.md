---
paths:
  - "hooks/**"
---

# hooks

상태를 가진 로직이 두 파일 이상에서 쓰일 때만 `hooks/`에 둔다. 상세는 루트 [`CONVENTIONS.md`](../../CONVENTIONS.md).

- 한 화면만 쓰면 그 컴포넌트의 `// hooks`에 둔다.
- 상태가 없는 함수는 `utils/`다.
- 파일 이름은 `use` + 대상, camelCase.
