package kr.ac.kunsan.campusreport.dto;

import kr.ac.kunsan.campusreport.domain.Facility;
import lombok.Getter;

@Getter
public class FacilityResponse {

    private Long id;
    private String name;

    public static FacilityResponse from(Facility facility) {
        FacilityResponse dto = new FacilityResponse();
        dto.id = facility.getId();
        dto.name = facility.getName();
        return dto;
    }
}