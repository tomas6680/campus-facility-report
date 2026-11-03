package kr.ac.kunsan.campusreport.service;

import kr.ac.kunsan.campusreport.dto.FacilityResponse;
import kr.ac.kunsan.campusreport.repository.FacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<FacilityResponse> findAll() {
        return facilityRepository.findByActiveTrue().stream()
                .map(FacilityResponse::from)
                .toList();
    }
}