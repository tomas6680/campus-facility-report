package kr.ac.kunsan.campusreport.dto;

import kr.ac.kunsan.campusreport.domain.FacilityType;
import kr.ac.kunsan.campusreport.domain.RiskLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportCreateRequest {

    private Long reporterId;
    private Long facilityId;
    private String detailLocation;
    private FacilityType facilityType;
    private String title;
    private String content;
    private RiskLevel riskLevel;
}