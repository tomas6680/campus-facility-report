-- 캠퍼스 시설 고장·안전 신고 우선처리 시스템
-- 데이터베이스 스키마
-- PostgreSQL 17

-- 1. 사용자
CREATE TABLE users (
    user_id     BIGSERIAL    PRIMARY KEY,
    login_id    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    name        VARCHAR(50)  NOT NULL,
    department  VARCHAR(100),
    role        VARCHAR(20)  NOT NULL DEFAULT 'REPORTER',
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_users_role CHECK (role IN ('REPORTER', 'STAFF', 'ADMIN'))
);

-- 2. 건물
CREATE TABLE facilities (
    facility_id BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    code        VARCHAR(20)  UNIQUE,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE
);

-- 3. 신고
CREATE TABLE reports (
    report_id       BIGSERIAL    PRIMARY KEY,
    reporter_id     BIGINT       NOT NULL,
    facility_id     BIGINT       NOT NULL,
    detail_location VARCHAR(100) NOT NULL,
    facility_type   VARCHAR(20)  NOT NULL,
    title           VARCHAR(200) NOT NULL,
    content         TEXT         NOT NULL,
    risk_level      VARCHAR(10)  NOT NULL,
    visibility      VARCHAR(10)  NOT NULL DEFAULT 'PUBLIC',
    status          VARCHAR(20)  NOT NULL DEFAULT 'RECEIVED',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users (user_id),
    CONSTRAINT fk_reports_facility FOREIGN KEY (facility_id) REFERENCES facilities (facility_id),
    CONSTRAINT ck_reports_type    CHECK (facility_type IN
        ('LIGHTING', 'HEATING', 'LEAK', 'ELEVATOR', 'SANITATION', 'SAFETY', 'ETC')),
    CONSTRAINT ck_reports_risk    CHECK (risk_level IN ('HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT ck_reports_visible CHECK (visibility IN ('PUBLIC', 'PRIVATE')),
    CONSTRAINT ck_reports_status  CHECK (status IN
        ('RECEIVED', 'CONFIRMED', 'IN_PROGRESS', 'DONE'))
);

-- 4. 첨부 이미지
CREATE TABLE attachments (
    attachment_id BIGSERIAL    PRIMARY KEY,
    report_id     BIGINT       NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_path   VARCHAR(500) NOT NULL,
    file_size     BIGINT       NOT NULL,
    content_type  VARCHAR(100) NOT NULL,
    uploaded_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachments_report FOREIGN KEY (report_id)
        REFERENCES reports (report_id) ON DELETE CASCADE,
    CONSTRAINT ck_attachments_size CHECK (file_size > 0 AND file_size <= 5242880)
);

-- 5. 담당자 배정
CREATE TABLE assignments (
    assignment_id BIGSERIAL PRIMARY KEY,
    report_id     BIGINT    NOT NULL,
    staff_id      BIGINT    NOT NULL,
    assigned_by   BIGINT    NOT NULL,
    assigned_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    released_at   TIMESTAMP,
    CONSTRAINT fk_assignments_report FOREIGN KEY (report_id) REFERENCES reports (report_id),
    CONSTRAINT fk_assignments_staff  FOREIGN KEY (staff_id) REFERENCES users (user_id),
    CONSTRAINT fk_assignments_admin  FOREIGN KEY (assigned_by) REFERENCES users (user_id),
    CONSTRAINT ck_assignments_period CHECK (released_at IS NULL OR released_at >= assigned_at)
);

-- 6. 상태변경 이력
CREATE TABLE status_history (
    history_id  BIGSERIAL   PRIMARY KEY,
    report_id   BIGINT      NOT NULL,
    from_status VARCHAR(20),
    to_status   VARCHAR(20) NOT NULL,
    changed_by  BIGINT      NOT NULL,
    changed_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note        VARCHAR(500),
    CONSTRAINT fk_history_report FOREIGN KEY (report_id)
        REFERENCES reports (report_id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES users (user_id),
    CONSTRAINT ck_history_from CHECK (from_status IS NULL OR from_status IN
        ('RECEIVED', 'CONFIRMED', 'IN_PROGRESS', 'DONE')),
    CONSTRAINT ck_history_to   CHECK (to_status IN
        ('RECEIVED', 'CONFIRMED', 'IN_PROGRESS', 'DONE'))
);

-- 인덱스
CREATE INDEX idx_reports_dup       ON reports (facility_id, facility_type, status);
CREATE INDEX idx_reports_reporter  ON reports (reporter_id, created_at DESC);
CREATE INDEX idx_reports_status    ON reports (status, created_at DESC);
CREATE INDEX idx_history_report    ON status_history (report_id, changed_at);
CREATE INDEX idx_assignments_staff ON assignments (staff_id) WHERE released_at IS NULL;