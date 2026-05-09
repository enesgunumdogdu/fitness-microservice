FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Pre-create the JWT keys directory with app ownership so a fresh Docker
# named volume mount inherits the right uid/gid (Docker copies image dir
# ownership onto an empty named volume on first run). Existing volumes
# from before this change need a one-time host-side `chown -R 100:101`
# of /var/lib/docker/volumes/<volume>/_data.
RUN addgroup -S app && adduser -S app -G app \
 && mkdir -p /var/lib/auth-keys \
 && chown -R app:app /app /var/lib/auth-keys
USER app
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
