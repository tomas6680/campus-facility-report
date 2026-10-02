package kr.ac.kunsan.campusreport.dto;

import kr.ac.kunsan.campusreport.domain.User;
import kr.ac.kunsan.campusreport.domain.UserRole;
import lombok.Getter;

@Getter
public class LoginResponse {

    private String token;
    private Long userId;
    private String name;
    private UserRole role;

    public static LoginResponse of(String token, User user) {
        LoginResponse dto = new LoginResponse();
        dto.token = token;
        dto.userId = user.getId();
        dto.name = user.getName();
        dto.role = user.getRole();
        return dto;
    }
}