---
paths:
  - "apps/peterpan-website/**"
  - "apps/peterpan-admin/**"
---

# app

앱 작업 시 해당 `CONVENTIONS.md`와 루트 `CONVENTIONS.md`를 따른다.

- `apps/peterpan-website/app/CONVENTIONS.md` — 재단 소개·소식·공시·기부하기·로그인. `@lib/posts`, `PageIntro`·`BrandText`, `page-*` 폭.
- `apps/peterpan-admin/app/CONVENTIONS.md` — 운영진 로그인, 게시물·공지·후원 문의·회원·권한·기본정보. `requireAdmin`·`requireOwner`, `@lib/adminData` 서버 액션, `AdminTable`·`AdminDrawer`.
- 세션·OAuth는 `@repo/auth`, DB·게시판 상수는 `@repo/db`.

- 라우트 파일은 `page.tsx`, `layout.tsx`. 페이지 컴포넌트만 `*Screen`.
- 본문 `*Section`. 한 화면만 쓰는 UI는 그 `page.tsx` 안에 둔다.
- 상태·브라우저 API가 있으면 `"use client"`.
