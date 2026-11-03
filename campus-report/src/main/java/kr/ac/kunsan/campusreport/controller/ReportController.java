package kr.ac.kunsan.campusreport.controller;

import kr.ac.kunsan.campusreport.dto.ReportCreateRequest;
import kr.ac.kunsan.campusreport.dto.ReportResponse;
import kr.ac.kunsan.campusreport.service.ReportService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ReportResponse create(@Valid @RequestBody ReportCreateRequest request,
                                 Authentication authentication) {
        Long reporterId = Long.valueOf(authentication.getName());
        return reportService.create(request, reporterId);
    }

    @GetMapping
    public List<ReportResponse> findAll() {
        return reportService.findAll();
    }

    @GetMapping("/{id}")
    public ReportResponse findById(@PathVariable Long id) {
        return reportService.findById(id);
    }
}