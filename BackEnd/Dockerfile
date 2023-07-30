FROM openjdk:17
WORKDIR /app
ARG JAR_FILE=./BackEnd/build/libs
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","app.jar"]