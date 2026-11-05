package kr.ac.kunsan.campusreport.service;

import kr.ac.kunsan.campusreport.domain.Facility;
import kr.ac.kunsan.campusreport.domain.Report;
import kr.ac.kunsan.campusreport.domain.ReportStatus;
import kr.ac.kunsan.campusreport.domain.StatusHistory;
import kr.ac.kunsan.campusreport.domain.User;
import kr.ac.kunsan.campusreport.dto.ReportCreateRequest;
import kr.ac.kunsan.campusreport.dto.ReportResponse;
import kr.ac.kunsan.campusreport.dto.StatusChangeRequest;
import kr.ac.kunsan.campusreport.dto.StatusHistoryResponse;
import kr.ac.kunsan.campusreport.exception.NotFoundException;
import kr.ac.kunsan.campusreport.repository.FacilityRepository;
import kr.ac.kunsan.campusreport.repository.ReportRepository;
import kr.ac.kunsan.campusreport.repository.StatusHistoryRepository;
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
    private final StatusHistoryRepository statusHistoryRepository;

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         FacilityRepository facilityRepository,
                         StatusHistoryRepository statusHistoryRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.facilityRepository = facilityRepository;
        this.statusHistoryRepository = statusHistoryRepository;
    }

    @Transactional
    public ReportResponse create(ReportCreateRequest request, Long reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new NotFoundException("신고자를 찾을 수 없습니다."));
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new NotFoundException("시설을 찾을 수 없습니다."));

        Report report = Report.create(
                reporter, facility, request.getDetailLocation(),
                request.getFacilityType(), request.getTitle(),
                request.getContent(), request.getRiskLevel());
        Report saved = reportRepository.save(report);

        statusHistoryRepository.save(
                StatusHistory.create(saved, null, ReportStatus.RECEIVED, reporter, "신고 접수"));

        return ReportResponse.from(saved);
    }

    @Transactional
    public ReportResponse changeStatus(Long reportId, StatusChangeRequest request, Long changerId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException("신고를 찾을 수 없습니다."));
        User changer = userRepository.findById(changerId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        ReportStatus fromStatus = report.getStatus();
        report.changeStatus(request.getStatus());

        statusHistoryRepository.save(
                StatusHistory.create(report, fromStatus, request.getStatus(), changer, request.getNote()));

        return ReportResponse.from(report);
    }

    public List<ReportResponse> findAll() {
        return reportRepository.findAll().stream()
                .map(ReportResponse::from)
                .toList();
    }

    public ReportResponse findById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("신고를 찾을 수 없습니다."));
        return ReportResponse.from(report);
    }

    public List<StatusHistoryResponse> findHistory(Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new NotFoundException("신고를 찾을 수 없습니다.");
        }
        return statusHistoryRepository.findByReportIdOrderByChangedAtAsc(reportId).stream()
                .map(StatusHistoryResponse::from)
                .toList();
    }
}