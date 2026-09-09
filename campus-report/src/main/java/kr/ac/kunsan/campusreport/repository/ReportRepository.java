package kr.ac.kunsan.campusreport.repository;

import kr.ac.kunsan.campusreport.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}