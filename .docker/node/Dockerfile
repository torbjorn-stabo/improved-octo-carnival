FROM node:alpine
RUN apk add --no-cache bash

WORKDIR /home/node/app

RUN addgroup --gid 1001 host-www-data
RUN adduser www-data --disabled-password -G host-www-data

COPY ./package.json ./
RUN npm install -g nodemon
RUN npm install

# USER www-data

# RUN sudo sysctl -w fs.inotify.max_user_watches=524288
# RUN sudo sysctl -w fs.inotify.max_user_instances=512
# RUN   echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf
# RUN   echo "fs.inotify.max_user_instances=512" >> /etc/sysctl.conf
# RUN ulimit -n 2048

#Give the path of your endpoint
ENTRYPOINT ["npm", "start"]  
# CMD ["npm", "run", "dev"]
# ENTRYPOINT ["bash"]
# CMD ["bash"]
