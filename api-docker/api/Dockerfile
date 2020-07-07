FROM openjdk:8

LABEL maintainer="seidl.matus@qbsw.sk"
LABEL description="Backend image for IIHF project"
LABEL version="1.9.1"

RUN mkdir -p data/export
RUN mkdir -p data/image
RUN mkdir -p data/file

RUN rm -fr /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Bratislava /etc/localtime

COPY executable/iihf-eps.jar iihf-eps.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","iihf-eps.jar"]
