package kr.ac.kunsan.campusreport.dto;

import kr.ac.kunsan.campusreport.domain.User;
import kr.ac.kunsan.campusreport.domain.UserRole;
import lombok.Getter;

@Getter
public class UserResponse {

    private Long id;
    private String loginId;
    private String name;
    private String department;
    private UserRole role;

    public static UserResponse from(User user) {
        UserResponse dto = new UserResponse();
        dto.id = user.getId();
        dto.loginId = user.getLoginId();
        dto.name = user.getName();
        dto.department = user.getDepartment();
        dto.role = user.getRole();
        return dto;
    }
}