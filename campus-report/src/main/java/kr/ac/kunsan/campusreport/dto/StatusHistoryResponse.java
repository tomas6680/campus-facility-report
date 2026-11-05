package kr.ac.kunsan.campusreport.dto;

import kr.ac.kunsan.campusreport.domain.ReportStatus;
import kr.ac.kunsan.campusreport.domain.StatusHistory;
import kr.ac.kunsan.campusreport.domain.UserRole;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class StatusHistoryResponse {

    private Long id;
    private ReportStatus fromStatus;
    private ReportStatus toStatus;
    private UserRole changedByRole;
    private LocalDateTime changedAt;
    private String note;

    public static StatusHistoryResponse from(StatusHistory history) {
        StatusHistoryResponse dto = new StatusHistoryResponse();
        dto.id = history.getHistoryId();
        dto.fromStatus = history.getFromStatus();
        dto.toStatus = history.getToStatus();
        dto.changedByRole = history.getChangedBy().getRole();
        dto.changedAt = history.getChangedAt();
        dto.note = history.getNote();
        return dto;
    }
}