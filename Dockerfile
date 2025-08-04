# -------- Build stage with Maven and JDK 21 --------
FROM maven:3.9.10-eclipse-temurin-21-alpine AS build
RUN apk add --no-cache nodejs npm
WORKDIR /home
COPY . /home
RUN mvn clean package -Pproduction -DskipTests

# -------- Runtime stage with JRE 21 --------
FROM eclipse-temurin:21.0.3_9-jre-alpine
COPY --from=build /home/target/*.jar /home/app.jar
EXPOSE 80
ENTRYPOINT ["java", "-jar", "/home/app.jar"]
