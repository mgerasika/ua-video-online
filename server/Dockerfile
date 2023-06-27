FROM cypress/base:16.17.0

ARG PORT
COPY . .

WORKDIR /app
RUN yarn
RUN yarn build

EXPOSE ${PORT}

CMD [ "yarn",  "start" ]
