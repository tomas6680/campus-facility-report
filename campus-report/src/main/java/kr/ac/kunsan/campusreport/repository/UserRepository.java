package kr.ac.kunsan.campusreport.repository;

import kr.ac.kunsan.campusreport.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}