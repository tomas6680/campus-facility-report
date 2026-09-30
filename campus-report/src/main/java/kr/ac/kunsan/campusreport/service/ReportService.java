package kr.ac.kunsan.campusreport.service;

import kr.ac.kunsan.campusreport.domain.Facility;
import kr.ac.kunsan.campusreport.domain.Report;
import kr.ac.kunsan.campusreport.domain.User;
import kr.ac.kunsan.campusreport.dto.ReportCreateRequest;
import kr.ac.kunsan.campusreport.dto.ReportResponse;
import kr.ac.kunsan.campusreport.repository.FacilityRepository;
import kr.ac.kunsan.campusreport.repository.ReportRepository;
import kr.ac.kunsan.campusreport.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         FacilityRepository facilityRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.facilityRepository = facilityRepository;
    }

    @Transactional
    public ReportResponse create(ReportCreateRequest request) {
        User reporter = userRepository.findById(request.getReporterId())
                .orElseThrow(() -> new IllegalArgumentException("신고자를 찾을 수 없습니다."));
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new IllegalArgumentException("시설을 찾을 수 없습니다."));

        Report report = Report.create(
                reporter, facility, request.getDetailLocation(),
                request.getFacilityType(), request.getTitle(),
                request.getContent(), request.getRiskLevel());

        return ReportResponse.from(reportRepository.save(report));
    }

    public List<ReportResponse> findAll() {
        return reportRepository.findAll().stream()
                .map(ReportResponse::from)
                .toList();
    }

    public ReportResponse findById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("신고를 찾을 수 없습니다."));
        return ReportResponse.from(report);
    }
}