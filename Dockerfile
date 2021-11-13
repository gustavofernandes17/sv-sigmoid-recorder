FROM node:12

WORKDIR /usr/app

COPY package*.json ./
COPY yarn.lock ./

RUN npm install

RUN apt-get -y update

RUN apt-get install -y ffmpeg

COPY . . 

EXPOSE 3333

CMD ["npm", "start"]