# build container
FROM openjdk:21-jdk as build

# copy source code to container
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .
COPY src src
RUN  chmod +x ./mvnw

# starting build
RUN ./mvnw clean package -DskipTests

# create container for running app
FROM openjdk:21-jdk

# place for installing additional programs

# copy jar file from build container
COPY --from=build target/*.jar app.jar

# expose port
EXPOSE 8080

# run app
ENTRYPOINT ["java","-jar","/app.jar"]
