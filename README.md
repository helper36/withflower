# 1039_WithFlower — 배포 전 수정 사항

## 1. 문의 폼 전송 URL (필수)
현재 `action="GOOGLE_APPS_SCRIPT_WEB_APP_URL"` 로 비어 있어서 전송이 막혀 있음.
Apps Script 웹 앱 배포 후 받은 URL(`https://script.google.com/macros/s/.../exec`)로 교체.

- `index.html:228`
- `product.html:297`

시트 이름은 `responses`, 첫 행 헤더는
`Timestamp | name | company | phone | email | type | contents | agree`

## 2. 연락처
- `index.html:162` CTA `대표전화 000-0000-0000` → 실제 번호
- 푸터 이메일 · 대표전화: 주석 처리돼 있음. 값을 넣고 주석 해제
  - `index.html:200-207`
  - `product.html:270-277`

## 3. 제품 정보 (`product.html`)
- `:94` 규격 (가로 x 세로 x 높이)
- `:98` 중량
- `:102` 포장 단위
- `:110` 권장 사용 환경
- `:115` "구매 링크로 이동하기" `href="#"` → 실제 구매 URL

## 4. 공유 미리보기 (og:image)
`og:image` 가 상대 경로라서 카카오톡 · 페이스북 미리보기에 이미지가 안 나옴.
도메인 확정 후 절대 경로로 교체.

- `index.html:17`, `product.html:17`
  `content="https://도메인/codeform/images/common/open-graph.jpg"`
