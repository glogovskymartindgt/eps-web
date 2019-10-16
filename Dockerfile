FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -fr /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Bratislava /etc/localtime

WORKDIR /usr/share/nginx/html

COPY dist .
