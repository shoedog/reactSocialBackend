FROM node
WORKDIR /src
EXPOSE 5000
ENTRYPOINT ["npm", "start"]
COPY . /src
RUN npm install
