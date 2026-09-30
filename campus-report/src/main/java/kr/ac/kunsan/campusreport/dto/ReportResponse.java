package kr.ac.kunsan.campusreport.dto;

import kr.ac.kunsan.campusreport.domain.FacilityType;
import kr.ac.kunsan.campusreport.domain.ReportStatus;
import kr.ac.kunsan.campusreport.domain.RiskLevel;
import lombok.Getter;
import java.time.LocalDateTime;
import kr.ac.kunsan.campusreport.domain.Report;
@Getter
public class ReportResponse {

    private Long id;
    private String title;
    private String content;
    private String facilityName;
    private String detailLocation;
    private FacilityType facilityType;
    private RiskLevel riskLevel;
    private ReportStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReportResponse from(Report report) {
        ReportResponse dto = new ReportResponse();
        dto.id = report.getId();
        dto.title = report.getTitle();
        dto.content = report.getContent();
        dto.facilityName = report.getFacility().getName();
        dto.detailLocation = report.getDetailLocation();
        dto.facilityType = report.getFacilityType();
        dto.riskLevel = report.getRiskLevel();
        dto.status = report.getStatus();
        dto.createdAt = report.getCreatedAt();
        dto.updatedAt = report.getUpdatedAt();
        return dto;
    }
}