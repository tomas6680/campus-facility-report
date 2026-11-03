package kr.ac.kunsan.campusreport.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import kr.ac.kunsan.campusreport.domain.ReportStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class StatusChangeRequest {

    @NotNull(message = "변경할 상태는 필수입니다.")
    private ReportStatus status;

    @Size(max = 500, message = "메모는 500자를 넘을 수 없습니다.")
    private String note;
}