# 피터팬 재단 웹

Next.js App Router (`service-peterpan-web`).

코드는 루트 [`CONVENTIONS.md`](CONVENTIONS.md)를 따른다. 실행·빌드는 [`README.md`](README.md)를 본다.

전역 작성 규칙은 `.claude/rules/always.md`가 세션마다 로드한다. 영역별 상세는 해당 경로를 열 때 `.claude/rules/`에서 로드한다.

| 경로          | 규칙                          |
| ------------- | ----------------------------- |
| `app/`        | `.claude/rules/app.md`        |
| `components/` | `.claude/rules/components.md` |
| `hooks/`      | `.claude/rules/hooks.md`      |
| `utils/`      | `.claude/rules/utils.md`      |
| `types/`      | `.claude/rules/types.md`      |

개인 오버라이드는 `CLAUDE.local.md`(gitignore)에 둔다.
