package kr.ac.kunsan.campusreport.domain;

public enum RiskLevel {
    HIGH, MEDIUM, LOW;

    public int priority() {
        return switch (this) {
            case HIGH -> 1;
            case MEDIUM -> 2;
            case LOW -> 3;
        };
    }
}