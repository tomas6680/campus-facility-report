package kr.ac.kunsan.campusreport.service;

import kr.ac.kunsan.campusreport.domain.Facility;
import kr.ac.kunsan.campusreport.domain.FacilityType;
import kr.ac.kunsan.campusreport.domain.Report;
import kr.ac.kunsan.campusreport.domain.ReportStatus;
import kr.ac.kunsan.campusreport.domain.RiskLevel;
import kr.ac.kunsan.campusreport.domain.StatusHistory;
import kr.ac.kunsan.campusreport.domain.User;
import kr.ac.kunsan.campusreport.dto.StatusChangeRequest;
import kr.ac.kunsan.campusreport.exception.InvalidStatusChangeException;
import kr.ac.kunsan.campusreport.exception.NotFoundException;
import kr.ac.kunsan.campusreport.repository.FacilityRepository;
import kr.ac.kunsan.campusreport.repository.ReportRepository;
import kr.ac.kunsan.campusreport.repository.StatusHistoryRepository;
import kr.ac.kunsan.campusreport.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@DisplayName("ReportService 상태 변경")
class ReportServiceTest {

    private ReportRepository reportRepository;
    private UserRepository userRepository;
    private StatusHistoryRepository statusHistoryRepository;
    private ReportService reportService;

    private Report report;
    private User staff;

    @BeforeEach
    void setUp() {
        // DB 대신 가짜 저장소(Mock)를 넣어 서비스 로직만 검증한다
        reportRepository = mock(ReportRepository.class);
        userRepository = mock(UserRepository.class);
        statusHistoryRepository = mock(StatusHistoryRepository.class);
        reportService = new ReportService(reportRepository, userRepository,
                mock(FacilityRepository.class), statusHistoryRepository);

        User reporter = User.create("reporter", "encoded-password", "신고자", "테스트학과");
        report = Report.create(reporter, new Facility(), "3층 남자화장실",
                FacilityType.LEAK, "천장 누수", "물이 떨어집니다", RiskLevel.HIGH);
        staff = User.create("staff", "encoded-password", "담당자", "시설관리팀");

        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));
        when(userRepository.findById(2L)).thenReturn(Optional.of(staff));
    }

    private StatusChangeRequest request(ReportStatus status, String note) {
        StatusChangeRequest request = new StatusChangeRequest();
        request.setStatus(status);
        request.setNote(note);
        return request;
    }

    @Test
    @DisplayName("상태를 바꾸면 이전 상태·새 상태·변경자·메모가 담긴 이력이 저장된다")
    void savesHistory() {
        reportService.changeStatus(1L, request(ReportStatus.CONFIRMED, "현장 확인"), 2L);

        ArgumentCaptor<StatusHistory> captor = ArgumentCaptor.forClass(StatusHistory.class);
        verify(statusHistoryRepository).save(captor.capture());
        StatusHistory history = captor.getValue();

        assertThat(history.getFromStatus()).isEqualTo(ReportStatus.RECEIVED);
        assertThat(history.getToStatus()).isEqualTo(ReportStatus.CONFIRMED);
        assertThat(history.getChangedBy()).isSameAs(staff);
        assertThat(history.getNote()).isEqualTo("현장 확인");
        assertThat(report.getStatus()).isEqualTo(ReportStatus.CONFIRMED);
    }

    @Test
    @DisplayName("단계를 건너뛰려 하면 예외가 나고 이력은 저장하지 않는다")
    void noHistoryWhenInvalid() {
        assertThatThrownBy(() -> reportService.changeStatus(1L, request(ReportStatus.DONE, null), 2L))
                .isInstanceOf(InvalidStatusChangeException.class);

        verify(statusHistoryRepository, never()).save(any());
        assertThat(report.getStatus()).isEqualTo(ReportStatus.RECEIVED);
    }

    @Test
    @DisplayName("없는 신고면 NotFoundException이 나고 이력은 저장하지 않는다")
    void notFound() {
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reportService.changeStatus(99L, request(ReportStatus.CONFIRMED, null), 2L))
                .isInstanceOf(NotFoundException.class);

        verify(statusHistoryRepository, never()).save(any());
    }
}