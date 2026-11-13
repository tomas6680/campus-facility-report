# 캠퍼스 시설 고장·안전 신고 우선처리 시스템

국립군산대학교 ICT특성화취업연계형사업단 13기 개인 풀스택 프로젝트

## 프로젝트 소개

캠퍼스 내 시설 고장과 안전 위험 요소를 신고하고, 접수부터 처리 완료까지의 상태를 추적하는 웹 서비스입니다.

기존에 운영 중인 시설보수 신청 시스템을 직접 사용해본 결과 확인한 네 가지 한계를 개선하는 것을 목표로 합니다.

- 처리 상태가 처리중·완료 2단계뿐이라 진행 단계를 알 수 없음
- 중복·유사 신고가 걸러지지 않음
- 위험도 입력이 없어 처리 순서 판단 근거가 없음
- 신고자 실명과 소속이 목록에 노출됨

## 기술 스택

| 구분 | 기술 |
|---|---|
| 프론트엔드 | TypeScript, React |
| 백엔드 | Java, Spring Boot, Spring Security |
| 데이터베이스 | PostgreSQL |
| 도구 | GitHub, Swagger, Docker |

## 주요 기능

- 회원가입·로그인 (JWT 인증)
- 역할 구분 — 신고자 / 처리 담당자 / 관리자
- 신고 등록 (건물, 위치, 시설유형, 위험도, 공개범위, 사진 첨부)
- 등록 전 중복 신고 확인
- 상태 전이 관리 (접수 → 확인 → 처리중 → 완료)
- 담당자 배정
- 역할별 접근제어
- 상태변경 이력 기록
- 건물·유형·상태별 현황 대시보드

## 실행 방법

Docker Desktop만 있으면 DB·백엔드·프론트를 명령 한 번으로 실행할 수 있습니다. JDK, Node.js, PostgreSQL을 따로 설치할 필요가 없습니다.

### 1. 저장소 받기

```bash
git clone https://github.com/tomas6680/campus-facility-report.git
cd campus-facility-report
```

### 2. 비밀값 파일(.env) 만들기

`.env.example`을 참고해 프로젝트 루트에 `.env`를 만들고 두 값을 채웁니다. `.env`는 `.gitignore`에 들어 있어 저장소에 올라가지 않습니다.

| 이름 | 설명 |
|---|---|
| `DB_PASSWORD` | Docker DB(postgres 계정) 비밀번호 |
| `JWT_SECRET` | JWT 서명 키 (32바이트 이상 임의 문자열) |

임의 값이 들어간 `.env`를 한 번에 만드는 명령입니다. 값이 화면에 출력되지 않습니다.

Windows PowerShell

```powershell
$r=[Security.Cryptography.RandomNumberGenerator]::Create(); $a=New-Object byte[] 18; $b=New-Object byte[] 48; $r.GetBytes($a); $r.GetBytes($b); Set-Content .env -Encoding ASCII -Value ("DB_PASSWORD="+[BitConverter]::ToString($a).Replace('-','')),("JWT_SECRET="+[Convert]::ToBase64String($b))
```

macOS·Linux

```bash
printf "DB_PASSWORD=%s\nJWT_SECRET=%s\n" "$(openssl rand -hex 18)" "$(openssl rand -base64 48 | tr -d '\n')" > .env
```

값이 비어 있으면 `docker compose`가 실행을 거부합니다.

### 3. 실행

```bash
docker compose up --build
```

처음 실행할 때는 이미지 다운로드와 빌드로 몇 분이 걸립니다. 로그에 `Started CampusReportApplication`이 보이면 http://localhost:3000 에 접속합니다.

### 시연용 계정

| 아이디 | 비밀번호 | 역할 |
|---|---|---|
| test02 | password123 | 신고자 |
| test03 | password123 | 담당자 (상태 변경 가능) |

시연용 계정과 신고 4건은 DB를 처음 만들 때 `db/schema.sql`, `db/seed.sql`로 자동 입력됩니다. 시연용 비밀번호이므로 실제 운영에는 사용하지 않습니다.

### 구성

```txt
브라우저 → localhost:3000 → frontend (nginx)
                              ├─ 화면: React 빌드 파일
                              └─ /api 요청 → backend (Spring Boot) → db (PostgreSQL 17)
```

- 외부에 열린 포트는 frontend(3000) 하나입니다. backend와 db는 컨테이너 내부 네트워크에서만 통신합니다.
- DB 데이터는 Docker 볼륨(`db-data`)에 저장되어 컨테이너를 다시 만들어도 유지됩니다.

### 종료·초기화

| 명령 | 설명 |
|---|---|
| `docker compose down` | 컨테이너 종료 (DB 데이터는 유지) |
| `docker compose up -d` | 백그라운드로 실행 |
| `docker compose logs -f backend` | 백엔드 로그 보기 |
| `docker compose down -v` | 컨테이너와 DB 데이터 삭제. 다음 실행 때 schema.sql·seed.sql로 다시 초기화 |

`.env`의 `DB_PASSWORD`를 바꿨다면 `docker compose down -v`로 DB를 다시 만들어야 적용됩니다.

### 개발 모드로 실행 (선택)

IntelliJ에서 백엔드(8080)를, `campus-report-front`에서 `npm run dev`로 프론트(5173)를 띄우는 방식도 가능합니다. 이 경우 PC에 PostgreSQL 17과 `campus_report` DB(`db/schema.sql`, `db/seed.sql` 실행), 환경 변수 `DB_PASSWORD`·`JWT_SECRET`이 필요합니다.

## 개발 일정

2026.08.24 ~ 11.15 (12주)

| 주차 | 내용 |
|---|---|
| 1 | 문제 정의, 사용자 조사 |
| 2 | 기능표, 사용자 흐름, 화면 설계 |
| 3 | ERD, 테이블 정의서 |
| 4 | Spring Boot 프로젝트, API 명세 |
| 5 | 신고 CRUD, DB 연동 |
| 6 | JWT 로그인, 역할별 권한 |
| 7 | React 화면 구현 |
| 8 | 프론트엔드·백엔드·DB 통합 |
| 9 | 핵심 업무로직 |
| 10 | 테스트, 입력값 검증 |
| 11 | Docker, 배포 |
| 12 | 최종 결과물 작성 |