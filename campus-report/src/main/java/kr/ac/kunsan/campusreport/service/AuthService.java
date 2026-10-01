package kr.ac.kunsan.campusreport.service;

import kr.ac.kunsan.campusreport.domain.User;
import kr.ac.kunsan.campusreport.dto.SignupRequest;
import kr.ac.kunsan.campusreport.dto.UserResponse;
import kr.ac.kunsan.campusreport.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.ac.kunsan.campusreport.exception.DuplicateException;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new DuplicateException("이미 사용 중인 로그인 ID입니다.");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.create(
                request.getLoginId(), encodedPassword,
                request.getName(), request.getDepartment());

        return UserResponse.from(userRepository.save(user));
    }
}