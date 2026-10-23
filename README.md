# 피터팬 재단

재단법인 피터팬 자폐인복지재단 홈페이지. Turborepo 모노레포이고, 앱은 Next.js, 데이터는 Supabase입니다.

## 구조

- `apps/web` 공개 사이트, 게시판, 관리자, 카카오·구글 로그인
- `packages/db` Drizzle 스키마와 데이터베이스 연결

환경 변수는 `apps/web/.env`에 둡니다. 예시는 루트 `.env.example`입니다.

## 실행

```bash
npm install
npm run db:migrate
npm run db:bootstrap
npm run dev
```

개발 서버는 http://localhost:3000 입니다.

## 로그인에 더 필요한 값

`apps/web/.env`에 아래를 넣습니다.

- `GOOGLE_CLIENT_SECRET` 구글 클라우드 콘솔의 클라이언트 보안 비밀번호
- `KAKAO_CLIENT_SECRET` 카카오 콘솔에서 시크릿을 켠 경우에만
- `ADMIN_EMAILS` 관리자로 쓸 이메일. 쉼표로 여러 명

리다이렉트 주소는 로컬 기준 아래 두 개입니다. 배포 도메인도 같은 경로로 등록합니다.

- `http://localhost:3000/auth/kakao/callback`
- `http://localhost:3000/auth/google/callback`

카카오 동의 항목은 닉네임, 프로필 사진, 이메일입니다.

## 데이터

소식, 경영공시, 기부금 공시, 후원 문의, 하단 연락처는 Supabase Postgres에 있습니다. 첨부파일은 `documents`, `media` 공개 버킷입니다. 정관 PDF는 `apps/web/public/docs/bylaws.pdf`와 버킷에 함께 있습니다.

홈과 마을 사진 일부는 실제 마을 촬영본이 생기기 전의 예시입니다.
