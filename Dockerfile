# Multi-stage Dockerfile for HavenEstate Spring Boot Backend (Root Context)
# Stage 1: Build JAR using Maven
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app

# Copy Maven wrapper and POM from backend directory
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B || true

# Copy backend source code and build production artifact
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests -B

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
