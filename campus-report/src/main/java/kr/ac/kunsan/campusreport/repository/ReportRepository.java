package kr.ac.kunsan.campusreport.repository;

import kr.ac.kunsan.campusreport.domain.Report;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // 목록 응답에 시설 이름이 필요하므로 시설을 조인해서 한 번에 조회 (N+1 방지)
    @Override
    @EntityGraph(attributePaths = "facility")
    List<Report> findAll();
}