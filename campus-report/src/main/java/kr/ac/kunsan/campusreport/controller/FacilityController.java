package kr.ac.kunsan.campusreport.controller;

import kr.ac.kunsan.campusreport.dto.FacilityResponse;
import kr.ac.kunsan.campusreport.service.FacilityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public List<FacilityResponse> findAll() {
        return facilityService.findAll();
    }
}