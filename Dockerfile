FROM nginx:alpine

COPY ./dist /usr/share/nginx/html/bird

EXPOSE 80