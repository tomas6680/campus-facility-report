package kr.ac.kunsan.campusreport.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "login_id", nullable = false)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private String department;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public static User create(String loginId, String encodedPassword,
                              String name, String department) {
        User user = new User();
        user.loginId = loginId;
        user.password = encodedPassword;
        user.name = name;
        user.department = department;
        user.role = UserRole.REPORTER;
        user.createdAt = LocalDateTime.now();
        return user;
    }
}