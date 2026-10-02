package kr.ac.kunsan.campusreport.service;

import kr.ac.kunsan.campusreport.config.JwtProvider;
import kr.ac.kunsan.campusreport.domain.User;
import kr.ac.kunsan.campusreport.dto.LoginRequest;
import kr.ac.kunsan.campusreport.dto.LoginResponse;
import kr.ac.kunsan.campusreport.dto.SignupRequest;
import kr.ac.kunsan.campusreport.dto.UserResponse;
import kr.ac.kunsan.campusreport.exception.DuplicateException;
import kr.ac.kunsan.campusreport.exception.UnauthorizedException;
import kr.ac.kunsan.campusreport.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
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

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return LoginResponse.of(jwtProvider.createToken(user), user);
    }
}