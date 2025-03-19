FROM node:20
WORKDIR /workspaces/150ScheduleManagment
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000