package kr.ac.kunsan.campusreport.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class SecurityErrorHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    // 인증 실패: 토큰이 없거나 만료·위조됨 → 401
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized", "로그인이 필요합니다.");
    }

    // 인가 실패: 로그인은 했지만 권한이 없음 → 403
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        writeError(response, HttpServletResponse.SC_FORBIDDEN, "Forbidden", "접근 권한이 없습니다.");
    }

    // 필터 단계 응답은 GlobalExceptionHandler를 거치지 않으므로 같은 형식의 JSON을 직접 작성한다
    private void writeError(HttpServletResponse response, int status, String error, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("""
                {"timestamp":"%s","status":%d,"error":"%s","message":"%s"}"""
                .formatted(LocalDateTime.now(), status, error, message));
    }
}