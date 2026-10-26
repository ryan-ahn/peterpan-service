# service-peterpan

재단법인 피터팬 자폐인복지재단 웹 서비스 모노레포. Turborepo, Next.js App Router, Tailwind CSS v4, Supabase.

작성 규칙은 [`CONVENTIONS.md`](CONVENTIONS.md). Claude/Cursor 에이전트 안내는 [`CLAUDE.md`](CLAUDE.md).

---

## 요구 사항

- Node.js **24** ([`.tool-versions`](.tool-versions), 루트 `package.json` `engines`)
- npm **11** (루트 `package.json` `packageManager`)

---

## 환경 변수

루트 `.env` 하나를 두 앱과 `packages/db` 스크립트가 함께 읽는다. 예시는 [`.env.example`](.env.example).

| 이름                                                   | 용도                                    |
| ------------------------------------------------------ | --------------------------------------- |
| `DATABASE_URL`                                         | Supabase Postgres 연결 문자열 (Drizzle) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY` | Supabase 프로젝트 주소·공개 키          |
| `SUPABASE_SERVICE_ROLE_KEY`                            | 서버 전용. 회원 삭제·파일 업로드        |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADMIN_URL`        | 두 앱이 서로 링크할 주소                |

---

## 실행

```bash
npm install
npm run db:migrate
npm run db:bootstrap
npm run dev
```

| 앱                 | 주소                                           |
| ------------------ | ---------------------------------------------- |
| `peterpan-website` | [http://localhost:3000](http://localhost:3000) |
| `peterpan-admin`   | [http://localhost:3001](http://localhost:3001) |

`db:migrate`는 테이블을, `db:bootstrap`은 스토리지 버킷과 처음 게시물·정관 PDF(`packages/db/seed/bylaws.pdf`)를 만든다.

---

## 로그인

두 앱 모두 Supabase Auth의 카카오·구글 로그인이다. 버튼은 `/auth/{kakao,google}`로 가고, 돌아온 코드는 `/auth/callback`에서 세션으로 바꾼다. 로직은 `packages/auth` 하나다.

어드민은 `admin_members` 테이블의 오너·슈퍼 관리자·관리자만 들어간다. 오너는 한 명으로 고정이고 `0002_admin_members.sql`이 지정한다. 슈퍼 관리자는 오너만 지정·해제한다. 슈퍼 관리자는 어드민 권한 관리(`/permissions`)에서 회원을 관리자로 등록하고, 관리자가 쓸 메뉴를 고르고, 회원으로 내린다. 새 관리자는 먼저 한 번 로그인해 회원으로 잡혀야 지정할 수 있다.

어드민은 탭마다 10분이 지나면 자동으로 로그아웃한다. 남은 1분부터 메뉴에서, 30초부터 화면 위 알림에서 10분을 다시 연장할 수 있다. 시간은 `sessionStorage`에 두므로 새로고침해도 이어지고, 새 탭은 새로 센다. 로직은 `apps/peterpan-admin/components/adminShell.tsx`에 있다.

카카오 REST API 키·클라이언트 시크릿, 구글 클라이언트 ID·시크릿은 Supabase의 Authentication → Providers에 넣는다. 카카오·구글 콘솔에 등록하는 리다이렉트는 Supabase 콜백 하나다.

- `https://<프로젝트-ref>.supabase.co/auth/v1/callback`

로그인이 끝난 뒤 돌아오는 주소는 Supabase의 Redirect URLs에 둔다. `https://www.peterpan.or.kr/**`, `https://admin.peterpan.or.kr/**`, `https://dev.peterpan.or.kr/**`, `http://localhost:3000/**`, `http://localhost:3001/**`.

카카오 동의 항목은 닉네임, 프로필 사진이다. 이메일은 비즈 앱 권한이 열린 뒤에 동의 항목과 scope에 넣는다.

---

## 데이터

재단 소식(공지·활동·언론 보도), 경영 공시, 기부금 공시, 후원 문의, 하단 연락처는 Supabase Postgres에 있다. 공지는 `notices`, 나머지 글은 `posts` 테이블이다. 첨부는 `documents`, 이미지는 `media` 공개 버킷이다. 정관은 어드민 `/bylaws`에서 판마다 `documents` 버킷에 올리고, `bylaws` 테이블에서 노출 1건을 고른다. 조직도는 어드민 `/organization`에서 짜고 `site_settings`의 `organization_chart`에 JSON으로 저장한다.

홈과 마을 사진 일부는 실제 마을 촬영본이 생기기 전의 예시다.

---

## 스크립트

루트에서 실행한다.

| 명령                              | 하는 일                         |
| --------------------------------- | ------------------------------- |
| `npm run dev`                     | 두 앱 개발 서버                 |
| `npm run dev:website`             | 웹사이트만                      |
| `npm run dev:admin`               | 어드민만                        |
| `npm run build`                   | 전체 프로덕션 빌드              |
| `npm run check-types`             | 타입 검사 (`next typegen` 포함) |
| `npm run lint`                    | ESLint                          |
| `npm run check`                   | 타입 검사 + 린트                |
| `npm run format`                  | Prettier                        |
| `npm run db:migrate`              | 스키마 반영                     |
| `npm run db:bootstrap`            | 버킷·초기 데이터                |
| `npm run deploy:peterpan-website` | 웹사이트 Vercel 프로덕션 배포   |
| `npm run deploy:peterpan-admin`   | 어드민 Vercel 프로덕션 배포     |

배포는 루트 전체를 올리고 각 앱 `vercel.json`의 설치·빌드 명령(`npm ci`, `turbo run build --filter=…`)으로 빌드한다. Git 푸시 자동 배포는 꺼 두었다. 환경 변수는 로컬 `.env`가 아니라 Vercel 프로젝트 설정에서 읽는다. 처음 한 번 `npx vercel login`이 필요하다.

---

## 디렉터리

| 경로                          | 내용                                                           |
| ----------------------------- | -------------------------------------------------------------- |
| `apps/peterpan-website/`      | 재단 소개·소식·공시·기부하기·로그인                            |
| `apps/peterpan-admin/`        | 운영 어드민 (게시물·공지·후원 문의·회원·기본정보)              |
| `packages/ui/`                | 공용 디자인 시스템 (Button, Chip, Input, Modal, Carousel 등)   |
| `packages/tailwind-config/`   | 디자인 토큰 (`tokens.css`, `tailwind.css`, `theme.ts`)         |
| `packages/db/`                | Drizzle 스키마·연결, 게시판 상수, 하단 연락처, 마이그레이션    |
| `packages/auth/`              | Supabase 클라이언트, 세션, 카카오·구글 OAuth                   |
| `packages/typescript-config/` | tsconfig 프리셋 (`base`, `library`, `nextjs`, `react-library`) |

앱·패키지 `tsconfig.json`은 `@repo/typescript-config`를 상속한다. Next 앱은 `nextjs.json`, `@repo/ui`는 `react-library.json`, `db`·`auth`는 `library.json`, `tailwind-config`는 `base.json`이다.
