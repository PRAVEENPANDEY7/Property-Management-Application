# Multi-stage Dockerfile for HavenEstate Spring Boot Backend (Backend Context)
# Stage 1: Build JAR using official Maven 3.9 + Temurin 17 image
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy POM first for dependency caching
COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy source code and build production artifact
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user and persistent upload directory
RUN groupadd -r haven && useradd -r -g haven haven \
    && mkdir -p /var/data/havenestate/uploads \
    && chown -R haven:haven /app /var/data/havenestate/uploads

# Copy built JAR from builder stage
COPY --from=builder --chown=haven:haven /app/target/property-management-backend-1.0.0.jar app.jar

USER haven

# Render provides PORT dynamically at runtime
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV STORAGE_LOCATION=/var/data/havenestate/uploads

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
