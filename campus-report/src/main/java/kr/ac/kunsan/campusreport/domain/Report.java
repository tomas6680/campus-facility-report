package kr.ac.kunsan.campusreport.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @Column(name = "detail_location", nullable = false)
    private String detailLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "facility_type", nullable = false)
    private FacilityType facilityType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public static Report create(User reporter, Facility facility, String detailLocation,
                                FacilityType facilityType, String title, String content,
                                RiskLevel riskLevel) {
        Report report = new Report();
        report.reporter = reporter;
        report.facility = facility;
        report.detailLocation = detailLocation;
        report.facilityType = facilityType;
        report.title = title;
        report.content = content;
        report.riskLevel = riskLevel;
        report.visibility = Visibility.PUBLIC;
        report.status = ReportStatus.RECEIVED;
        report.createdAt = LocalDateTime.now();
        report.updatedAt = LocalDateTime.now();
        return report;
    }
}