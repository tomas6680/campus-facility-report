# ---- 1단계: 빌드 (JDK + Gradle로 실행 가능한 jar 생성) ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# 빌드 설정만 먼저 복사: 소스만 바뀌면 Gradle·의존성 다운로드 단계는 캐시를 재사용한다
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon > /dev/null

COPY src src
RUN ./gradlew bootJar --no-daemon

# ---- 2단계: 실행 (JRE와 jar만 담는다: 이미지가 작고 소스·빌드 도구가 없음) ----
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --no-create-home spring
COPY --from=build /app/build/libs/*.jar app.jar

# root가 아닌 일반 계정으로 실행: 앱이 뚫려도 컨테이너 안에서 할 수 있는 일이 제한된다
USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
