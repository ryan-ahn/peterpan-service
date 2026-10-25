# service-peterpan

피터팬 재단 Turborepo 모노레포. 현재 앱: `peterpan-website`, `peterpan-admin` (Next.js).

코드는 루트 [`CONVENTIONS.md`](CONVENTIONS.md)를 따른다. 실행·빌드는 [`README.md`](README.md)를 본다.

전역 작성 규칙은 `.claude/rules/always.md`가 세션마다 로드한다. 영역별 상세는 해당 경로를 열 때 `.claude/rules/`에서 로드하며, 원문은 각 경로의 `CONVENTIONS.md`가 기준이다.

| 경로                         | 문서                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `apps/peterpan-website/app/` | [`apps/peterpan-website/app/CONVENTIONS.md`](apps/peterpan-website/app/CONVENTIONS.md) |
| `apps/peterpan-admin/app/`   | [`apps/peterpan-admin/app/CONVENTIONS.md`](apps/peterpan-admin/app/CONVENTIONS.md)     |
| `packages/ui/`               | [`packages/ui/CONVENTIONS.md`](packages/ui/CONVENTIONS.md)                             |

`apps/peterpan-website/AGENTS.md`, `apps/peterpan-admin/AGENTS.md`, 루트 `AGENTS.md`는 Next.js가 생성하는 에이전트 안내다. 삭제하지 말고 커밋에 포함한다.

@AGENTS.md

개인 오버라이드는 `CLAUDE.local.md`(gitignore)에 둔다.
