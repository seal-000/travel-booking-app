# Travel Booking App

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [Running Locally (Without Docker)](#running-locally-without-docker)
- [Project Structure](#project-structure)
- [CI/CD Pipeline](#cicd-pipeline)
- [AWS Deployment Guide](#aws-deployment-guide)
- [Future Improvements](#future-improvements)
- [License](#license)



## Project Overview

A full-stack app where you can search for flights and explore detailed information before booking. It shows a list of possible flights for travelers planning their next trip, with a responsive interface. The project is built with a production-ready infrastructure: Dockerized for consistency, powered by the Duffel API for live flight data, and hosted on AWS using ECS Fargate with automated deployments via GitHub Actions.



## Demo

🌐 **Live**: [http://travel-app-alb-128502854.us-east-2.elb.amazonaws.com/](http://travel-app-alb-128502854.us-east-2.elb.amazonaws.com/)

<img width="2537" height="1266" alt="image" src="https://github.com/user-attachments/assets/e6300cf5-00ff-4272-9587-fbc48bc63e6e" />
<img width="2533" height="1258" alt="image-1" src="https://github.com/user-attachments/assets/4a936511-d227-4318-a564-8141a5d6ea74" />
<img width="2553" height="1266" alt="image-2" src="https://github.com/user-attachments/assets/f07d9ee6-e26d-43ae-a483-cb567fab1062" />



## Features

- 🔍 **Flight Search** — Search by origin, destination, date, and number of guests. Supports Round Trip, One Way, and Multi-City trip types, with options for cabin class (Economy, etc.) and a "Direct flights only" filter
- 📋 **Availability Display** — Displays a ranked list of available flights showing airline logo, departure/arrival times, airports, total duration, number of stops, and price per option
- 🎛️ **Results Filtering** — Filter results in real time by number of stops (Direct, 1 stop, 2+ stops), price range, and specific airline
- 🔎 **Flight Details Modal** — Click "View Details" on any result to see a full breakdown: full airport names, flight number, airline, each leg of the journey with layover airports and wait times, total flight duration, and baggage inclusions (personal item, carry-on, checked bag)



## Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Frontend     | React, TypeScript, CSS                          |
| Backend      | Node.js, Express, TypeScript                    |
| Flight Data  | [Duffel API](https://duffel.com/)               |
| Containers   | Docker, Docker Compose                          |
| CI/CD        | GitHub Actions                                  |
| Registry     | AWS ECR (Elastic Container Registry)            |
| Compute      | AWS ECS (Elastic Container Service) + Fargate   |
| Networking   | AWS ALB (Application Load Balancer)             |



## Architecture

```
GitHub (push to main)
        │
        ▼
GitHub Actions CI/CD
  ├── Configure AWS credentials
  ├── Login to Amazon ECR
  ├── Build Docker image & push to ECR (tagged: latest)
  └── Force new ECS deployment (pulls latest image)
        │
        ▼
AWS Application Load Balancer (Port 80)
        │
        ▼
AWS ECS Fargate (Docker Container, Port 3001)
  ├── Express REST API
  ├── React Frontend (static build)
  └── Duffel API (live flight data)
```



## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker](https://www.docker.com/) & Docker Compose
- npm
- A [Duffel API](https://duffel.com/) account and access token

### Clone the Repository

```bash
git clone https://github.com/seal-000/travel-booking-app.git
cd travel-booking-app
```



## Environment Variables

Create a `.env` file in the project root:

```env
# Duffel API - flight search and booking
DUFFEL_ACCESS_TOKEN=your_duffel_token_here
```

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.  
> In production on AWS, this is set directly in the ECS Task Definition.



## Running with Docker

Make sure you have Docker Desktop installed.

```bash
docker build -t travel-app .
docker run -p 3001:3001 --env DUFFEL_ACCESS_TOKEN=your_token travel-app
```

The app will be available at `http://localhost:3001`.



## Running Locally (Without Docker)

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`



## Project Structure

```text
travel-booking-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
│
├── README.md                   # Project documentation
└── travel-booking-app/
    ├── public/                 # Static assets
    ├── server/                 # Backend Node.js/Express server
    │   └── index.js
    ├── src/                    # Frontend React source code
    │   ├── assets/             # Images, styling assets, etc.
    │   ├── components/         # Reusable React components
    │   │   ├── fields/         # UI form fields, modals, buttons
    │   │   ├── flight-search/  # Search box components
    │   │   └── layout/         # Layout grids and rows
    │   ├── pages/              # Main page views (Home, SearchResults)
    │   ├── services/           # Duffel API integration services
    │   ├── App.tsx             # Root component
    │   └── main.tsx            # Entry point
    ├── test/                   # Testing scripts
    ├── Dockerfile              # Containerization instructions
    ├── package.json            # Dependencies and scripts
    └── vite.config.ts          # Vite build configuration
```



## CI/CD Pipeline

Every push to the `main` branch triggers an automated deployment via GitHub Actions (`.github/workflows/deploy.yml`).

**Pipeline Steps:**

1. **Checkout code** — Pulls the latest code from the repository
2. **Configure AWS credentials** — Authenticates with AWS using `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` stored as GitHub Secrets
3. **Login to Amazon ECR** — Authenticates Docker with the AWS Elastic Container Registry
4. **Build & push Docker image** — Builds the Docker image from `travel-booking-app/` and pushes it to ECR tagged as `latest`
5. **Force new ECS deployment** — Calls `aws ecs update-service --force-new-deployment` on the `travel-app-cluster`, which tells Fargate to pull the new image and restart the containers

**GitHub Secrets required:**

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |

No manual steps required every merge to `main` ships to production automatically.



## AWS Deployment Guide

This app is deployed on AWS using ECR + ECS Fargate + ALB. Below is a full walkthrough of how the infrastructure was set up.

### Step 1 — Push Docker Image to Amazon ECR

AWS ECR is Amazon's private Docker image registry.

1. Go to the **AWS Console** → **Elastic Container Registry**
2. Click **"Create Repository"**, name it `travel-app`, set it to **Private**
3. Open the repository and click **"View push commands"**
4. Run the 4 provided commands in your terminal to authenticate and push your local image to ECR

📖 [Amazon ECR – Pushing a Docker Image](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)



### Step 2 — Run the Container with ECS + Fargate

1. Go to **Amazon ECS** → **Create Cluster**
   - Name: `travel-app-cluster`
   - Infrastructure: **AWS Fargate (Serverless)**

2. **Create a Task Definition**
   - Launch type: Fargate
   - CPU: `.25 vCPU` / Memory: `0.5 GB` (cost-efficient)
   - Image URI: paste your ECR image URI from Step 1
   - Environment variables: add `DUFFEL_ACCESS_TOKEN`
   - Port mapping: `3001`

3. **Create a Service** inside your cluster
   - Service name: `travel-app-task-definition-service`
   - Select the Task Definition above
   - Desired tasks: `1`
   - Load balancer: **Application Load Balancer (ALB)**
     - Create a new ALB that maps public **Port 80** → container **Port 3001**

📖 [Deploy an App on ECS using Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started-fargate.html)



### Step 3 — GitHub Actions Automation

After the initial setup, all future deployments are fully automated. Add your AWS credentials as GitHub Secrets in your repository under **Settings → Secrets and variables → Actions**:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

From that point on, every push to `main` will build a new Docker image, push it to ECR, and force ECS to redeploy.



## Future Improvements

- [ ] Allow up to 5 destinations in Multi-City search
- [ ] Price breakdown in more detail (flight fare, taxes, and airline fees)
- [ ] Option to select a fare type directly from the flight result card
- [ ] Better test coverage following best practices
- [ ] HTTPS and custom domain via AWS Route 53 + ACM




## License

MIT License — feel free to use this project as a reference or starting point.
