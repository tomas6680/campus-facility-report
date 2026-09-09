package kr.ac.kunsan.campusreport.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "facilities")
@Getter
@NoArgsConstructor
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facility_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    private String code;

    @Column(name = "is_active", nullable = false)
    private boolean active;
}