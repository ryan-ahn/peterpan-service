# 피터팬 재단 웹

Next.js App Router로 만든 피터팬 재단 소개 사이트.

작성 규칙은 [`CONVENTIONS.md`](CONVENTIONS.md).

## 요구 사항

Node.js 24. [`.tool-versions`](.tool-versions) 와 같다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 연다.

## 스크립트

| 명령            | 하는 일        |
| --------------- | -------------- |
| `npm run dev`   | 개발 서버      |
| `npm run build` | 프로덕션 빌드  |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint`  | ESLint         |

## 디렉터리

| 경로          | 내용                                  |
| ------------- | ------------------------------------- |
| `app/`        | 라우트, 루트 레이아웃, 전역 CSS 변수  |
| `components/` | 버튼, 텍스트, 아이콘, 헤더            |
| `assets/`     | 페이지에서 `next/image`로 쓰는 이미지 |
