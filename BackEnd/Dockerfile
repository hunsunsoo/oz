FROM openjdk:17
COPY backend/build/libs/*.jar app.jar
CMD ["java", "--enable-preview", "-jar", "app.jar"]