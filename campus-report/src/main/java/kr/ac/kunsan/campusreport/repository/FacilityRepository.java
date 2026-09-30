package kr.ac.kunsan.campusreport.repository;

import kr.ac.kunsan.campusreport.domain.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
}