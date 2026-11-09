-- 캠퍼스 시설 고장·안전 신고 우선처리 시스템
-- 개발·시연용 데이터 (schema.sql 다음에 실행)
-- 여러 번 실행해도 안전: 이미 있는 데이터는 건너뜀
-- 테스트 계정 비밀번호는 모두 password123 (개발·시연 전용, 운영 환경에서 사용 금지)

-- 1. 시설 (기준 데이터)
INSERT INTO facilities (name, code) VALUES
    ('공학관', 'ENG'),
    ('인문대학', 'HUM'),
    ('자연과학대학', 'SCI'),
    ('중앙도서관', 'LIB'),
    ('학생회관', 'STU'),
    ('생활관', 'DORM')
ON CONFLICT DO NOTHING;

-- 2. 테스트 계정 (비밀번호는 BCrypt 해시로 저장)
INSERT INTO users (login_id, password, name, department, role) VALUES
    ('test02', '$2a$10$RpMe41dHTi8m0KGRH.HAFeOYnhjt/KQh5dpF1bOdsJk34yvyhujzy', '홍길동', 'IT융합통신공학과', 'REPORTER'),
    ('test03', '$2a$10$8S7i.PHK6yPmlE4zpSh77uXFh4RQLLM/zqSako2p0/A2VhGxZ/.d2', '김담당', '시설관리팀', 'STAFF')
ON CONFLICT (login_id) DO NOTHING;

-- 회원가입 API로 먼저 만든 test03이 있으면 담당자로 변경
UPDATE users SET role = 'STAFF' WHERE login_id = 'test03';

-- 3. 시연용 신고 (같은 제목이 없을 때만 추가, 위험도·접수 시각을 섞어 정렬 확인용)
INSERT INTO reports (reporter_id, facility_id, detail_location, facility_type,
                     title, content, risk_level, created_at, updated_at)
SELECT u.user_id, f.facility_id, v.detail_location, v.facility_type,
       v.title, v.content, v.risk_level, v.created_at, v.created_at
FROM (VALUES
    ('공학관',     '3층 남자화장실', 'LEAK',     '3층 화장실 천장 누수', '천장에서 물이 계속 떨어지고 바닥이 젖어 미끄럽습니다.', 'HIGH',   NOW() - INTERVAL '3 days'),
    ('중앙도서관', '2층 열람실',     'LIGHTING', '열람실 형광등 깜빡임', '형광등이 계속 깜빡여서 공부하기 어렵습니다.',           'LOW',    NOW() - INTERVAL '2 days'),
    ('생활관',     '3층 샤워실',     'HEATING',  '샤워실 온수 안 나옴',  '아침마다 온수가 나오지 않습니다.',                      'MEDIUM', NOW() - INTERVAL '1 day'),
    ('학생회관',   '1층 계단',       'SAFETY',   '계단 난간 흔들림',     '난간이 흔들려서 넘어질 위험이 있습니다.',                'HIGH',   NOW() - INTERVAL '2 hours')
) AS v(facility_name, detail_location, facility_type, title, content, risk_level, created_at)
JOIN facilities f ON f.name = v.facility_name
JOIN users u ON u.login_id = 'test02'
WHERE NOT EXISTS (SELECT 1 FROM reports r WHERE r.title = v.title);

-- 4. 이력이 없는 신고에 최초 접수 이력 보충
INSERT INTO status_history (report_id, from_status, to_status, changed_by, changed_at, note)
SELECT r.report_id, NULL, 'RECEIVED', r.reporter_id, r.created_at, '신고 접수'
FROM reports r
WHERE NOT EXISTS (SELECT 1 FROM status_history h WHERE h.report_id = r.report_id);
