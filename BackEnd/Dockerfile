FROM openjdk:17-jre-slim
COPY backend/build/libs/*.jar app.jar
CMD ["java", "--enable-preview", "-jar", "app.jar"]