FROM openjdk:17
ARG JAR_FILE=*.jar
COPY ${JAR_FILE} app.jar
CMD ["java", "--enable-preview", "-jar", "app.jar"]