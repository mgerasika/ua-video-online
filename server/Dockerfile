FROM cypress/base:14.15.0

ARG PORT
COPY . .

WORKDIR /app
RUN yarn
RUN yarn build

EXPOSE ${PORT}

CMD [ "yarn",  "start" ]
