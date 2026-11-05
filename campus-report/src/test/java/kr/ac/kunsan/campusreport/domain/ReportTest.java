package kr.ac.kunsan.campusreport.domain;

import kr.ac.kunsan.campusreport.exception.InvalidStatusChangeException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Report 도메인 규칙")
class ReportTest {

    private static final LocalDateTime NOW = LocalDateTime.of(2026, 11, 5, 9, 0);

    private Report newReport(RiskLevel riskLevel, LocalDateTime createdAt) {
        User reporter = User.create("tester", "encoded-password", "테스터", "테스트학과");
        Report report = Report.create(reporter, new Facility(), "3층 남자화장실",
                FacilityType.LEAK, "천장 누수", "물이 떨어집니다", riskLevel);
        ReflectionTestUtils.setField(report, "createdAt", createdAt);
        return report;
    }

    private void finish(Report report) {
        report.changeStatus(ReportStatus.CONFIRMED);
        report.changeStatus(ReportStatus.IN_PROGRESS);
        report.changeStatus(ReportStatus.DONE);
    }

    private List<Report> sortByPriority(Report... reports) {
        return Stream.of(reports).sorted(Report.PRIORITY_ORDER).toList();
    }

    // ===== 상태 변경 규칙 =====

    @Test
    @DisplayName("다음 단계로는 변경된다")
    void changeToNextStep() {
        Report report = newReport(RiskLevel.HIGH, NOW);

        report.changeStatus(ReportStatus.CONFIRMED);

        assertThat(report.getStatus()).isEqualTo(ReportStatus.CONFIRMED);
    }

    @Test
    @DisplayName("단계를 건너뛰면 예외가 나고 상태는 그대로다")
    void skipStepFails() {
        Report report = newReport(RiskLevel.HIGH, NOW);

        assertThatThrownBy(() -> report.changeStatus(ReportStatus.DONE))
                .isInstanceOf(InvalidStatusChangeException.class)
                .hasMessage("현재 상태(RECEIVED)에서는 CONFIRMED(으)로만 변경할 수 있습니다.");
        assertThat(report.getStatus()).isEqualTo(ReportStatus.RECEIVED);
    }

    @Test
    @DisplayName("완료된 신고는 더 바꿀 수 없다")
    void doneCannotChange() {
        Report report = newReport(RiskLevel.HIGH, NOW);
        finish(report);

        assertThatThrownBy(() -> report.changeStatus(ReportStatus.RECEIVED))
                .isInstanceOf(InvalidStatusChangeException.class)
                .hasMessage("이미 처리가 완료된 신고입니다.");
    }

    // ===== 처리 우선순위 정렬 =====

    @Test
    @DisplayName("완료된 신고는 위험도가 높아도 미완료 신고보다 뒤에 온다")
    void doneGoesLast() {
        Report doneHigh = newReport(RiskLevel.HIGH, NOW.minusDays(1));
        finish(doneHigh);
        Report openLow = newReport(RiskLevel.LOW, NOW);

        assertThat(sortByPriority(doneHigh, openLow)).containsExactly(openLow, doneHigh);
    }

    @Test
    @DisplayName("미완료끼리는 늦게 접수됐어도 위험도가 높은 신고가 먼저 온다")
    void higherRiskFirst() {
        Report earlierLow = newReport(RiskLevel.LOW, NOW.minusHours(1));
        Report laterHigh = newReport(RiskLevel.HIGH, NOW);

        assertThat(sortByPriority(earlierLow, laterHigh)).containsExactly(laterHigh, earlierLow);
    }

    @Test
    @DisplayName("위험도가 같으면 먼저 접수된 신고가 먼저 온다")
    void olderFirstWhenSameRisk() {
        Report newer = newReport(RiskLevel.MEDIUM, NOW);
        Report older = newReport(RiskLevel.MEDIUM, NOW.minusHours(1));

        assertThat(sortByPriority(newer, older)).containsExactly(older, newer);
    }
}