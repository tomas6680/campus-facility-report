package kr.ac.kunsan.campusreport.domain;

public enum ReportStatus {
    RECEIVED, CONFIRMED, IN_PROGRESS, DONE;

    public ReportStatus next() {
        return switch (this) {
            case RECEIVED -> CONFIRMED;
            case CONFIRMED -> IN_PROGRESS;
            case IN_PROGRESS -> DONE;
            case DONE -> null;
        };
    }
}