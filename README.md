# Westerbork Commander's House App

A virtual tour through the commander's house at Camp Westerbork. Build using [Vue](https://vuejs.org/) for the UI and [Potree](http://potree.org/) for the visualization of the point clouds.

![App screenshot](screenshot.png)

## Data

In the project directory create a folder `pointclouds`. In this folder create a folder `ahn2` with the AHN2 ept tiles and a folder `commandantshuis` with the ept tiles of the commander's house.

This should result in the following file structure:

```sh
pointclouds/
          ├── ahn2/
          │   ├── ept-build.json
          │   ├── ept-data/
          │   ├── ept-hierarchy/
          │   ├── ept.json/
          │   └── ept-sources/
          └── commandantshuis/
             ├── ept-build.json
             ├── ept-data/
             ├── ept-hierarchy/
             ├── ept.json/
             └── ept-sources/
```

## Deploy using Docker

### Prerequisites

- Docker

### Build

In the project directory run:

```sh
docker-compose up -d
```

Wait until building is complete. When it is done the app is served on port 8000 (can be configured in the `docker-compose.yml` file). Use a webserver like nginx or apache to serve this port to the web.

### Update

```sh
git pull
docker-compose up -d --build
```

## Deploy manually

### Prerequisites

- npm

### Install

In the project directory run:

```
npm install
```

#### Build

In the project directory run:

```
npm run build
```

Serve the created `dist` and `pointclouds` folder using a webserver. Make sure the `pointclouds` folder is served relative to the `dist` folder, i.e. if `dist` is hosted on `example.com/viewer/`, `pointclouds` should be served on `example.com/viewer/pointclouds/`


## Develop

In the project directory run:

```
npm run serve
```

Browse to http://localhost:8080
