package kr.ac.kunsan.campusreport.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.ac.kunsan.campusreport.domain.FacilityType;
import kr.ac.kunsan.campusreport.domain.RiskLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportCreateRequest {

    @NotNull(message = "신고자 ID는 필수입니다.")
    private Long reporterId;

    @NotNull(message = "시설 ID는 필수입니다.")
    private Long facilityId;

    @NotBlank(message = "상세 위치는 필수입니다.")
    @Size(max = 100, message = "상세 위치는 100자를 넘을 수 없습니다.")
    private String detailLocation;

    @NotNull(message = "고장 유형은 필수입니다.")
    private FacilityType facilityType;

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 200, message = "제목은 200자를 넘을 수 없습니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @NotNull(message = "위험도는 필수입니다.")
    private RiskLevel riskLevel;
}