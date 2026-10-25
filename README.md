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

| 이름                                                    | 용도                                         |
| ------------------------------------------------------- | -------------------------------------------- |
| `DATABASE_URL`                                          | Supabase Postgres 연결 문자열 (Drizzle)      |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`  | Supabase 프로젝트 주소·공개 키               |
| `SUPABASE_SERVICE_ROLE_KEY`                             | 서버 전용. 로그인 세션 발급·파일 업로드      |
| `NEXT_PUBLIC_KAKAO_REST_API_KEY`, `KAKAO_CLIENT_SECRET` | 카카오 로그인. 시크릿은 콘솔에서 켠 경우에만 |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`  | 구글 로그인                                  |
| `ADMIN_EMAILS`                                          | 운영자 이메일. 쉼표로 여러 명                |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADMIN_URL`         | 두 앱이 서로 링크할 주소                     |

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

`db:migrate`는 테이블을, `db:bootstrap`은 스토리지 버킷과 처음 게시물·정관 PDF를 만든다.

---

## 로그인

두 앱 모두 카카오·구글 OAuth로 로그인한다. 로직은 `packages/auth` 하나다. `ADMIN_EMAILS`에 있는 이메일은 로그인할 때마다 운영자로 올라가고, 어드민은 운영자만 들어간다.

카카오·구글 콘솔에 아래 리다이렉트 주소를 모두 등록한다. 배포 도메인도 같은 경로다.

- `http://localhost:3000/auth/kakao/callback`
- `http://localhost:3000/auth/google/callback`
- `http://localhost:3001/auth/kakao/callback`
- `http://localhost:3001/auth/google/callback`

카카오 동의 항목은 닉네임, 프로필 사진, 이메일이다.

---

## 데이터

재단소식(공지·활동·언론보도), 경영공시, 기부금 공시, 후원 문의, 하단 연락처는 Supabase Postgres에 있다. 첨부는 `documents`, 이미지는 `media` 공개 버킷이다. 정관 PDF는 `apps/peterpan-website/public/docs/bylaws.pdf`와 버킷에 함께 있다.

홈과 마을 사진 일부는 실제 마을 촬영본이 생기기 전의 예시다.

---

## 스크립트

루트에서 실행한다.

| 명령                   | 하는 일                         |
| ---------------------- | ------------------------------- |
| `npm run dev`          | 두 앱 개발 서버                 |
| `npm run dev:website`  | 웹사이트만                      |
| `npm run dev:admin`    | 어드민만                        |
| `npm run build`        | 전체 프로덕션 빌드              |
| `npm run check-types`  | 타입 검사 (`next typegen` 포함) |
| `npm run lint`         | ESLint                          |
| `npm run check`        | 타입 검사 + 린트                |
| `npm run format`       | Prettier                        |
| `npm run db:migrate`   | 스키마 반영                     |
| `npm run db:bootstrap` | 버킷·초기 데이터                |

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
