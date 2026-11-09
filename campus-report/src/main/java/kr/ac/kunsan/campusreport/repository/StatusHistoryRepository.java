package kr.ac.kunsan.campusreport.repository;

import kr.ac.kunsan.campusreport.domain.StatusHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {

    // 이력 응답에 변경자 역할이 필요하므로 변경자를 조인해서 한 번에 조회 (N+1 방지)
    @EntityGraph(attributePaths = "changedBy")
    List<StatusHistory> findByReportIdOrderByChangedAtAsc(Long reportId);
}