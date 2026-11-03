package kr.ac.kunsan.campusreport.repository;

import kr.ac.kunsan.campusreport.domain.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {

    List<StatusHistory> findByReportIdOrderByChangedAtAsc(Long reportId);
}