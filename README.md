# Omira - Your AI Mentor

<div align="center">

<img width="1424" alt="Image" src="https://github.com/user-attachments/assets/b3f082da-98ae-404d-9e6d-4087188ce3e7" />

**Your AI-Powered Personal Mentor for Health and Communication**

This repository contains the client application code. For the complete application, you'll also need:
 - [Omira Server](https://github.com/Ritesh2351235/Omira-server) - Main server application with Firebase/Firestore integration
 - [Omira Notification](https://github.com/Ritesh2351235/Omira-notification) - Real-time analysis and notification service

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Made with React](https://img.shields.io/badge/Made%20with-React-blue)](https://reactjs.org/)
[![Powered by OpenAI](https://img.shields.io/badge/Powered%20by-OpenAI-green)](https://openai.com/)

[Features](#features) • [Quick Start](#quick-start) • [Installation](#installation) 

</div>

## About Omira

Omira is an innovative AI-powered personal mentor that helps you unlock your full potential by providing deep insights into your health and conversations. Using advanced AI technology, Omira analyzes your daily interactions and health patterns to offer personalized recommendations and reflections.

## Features

### Daily Health Dashboard
- Smart Nutrition Tracking: AI-powered analysis of your eating habits
- Visual Health Metrics: Beautiful visualizations of your health progress
- Personalized Insights: Custom recommendations based on your patterns

### Conversation Analysis
- Real-time Feedback: Instant analysis of your communication patterns
- Emotional Intelligence: Understand the emotional dynamics of your interactions
- Growth Opportunities: Actionable insights to improve your communication

### Custom MCP Server
- Personal Memory Server: Build your own Model Context Protocol server
- Privacy-First: Keep your data secure and under your control
- AI Integration: Seamless connection with Claude Desktop and Cursor

### AI-Powered Reflections
- Daily Insights: Get personalized reflections on your progress
- Pattern Recognition: Identify trends in your behavior and habits
- Actionable Feedback: Receive concrete suggestions for improvement

## Tech Stack

### Frontend
- React.js (v18)
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Query for data fetching
- Zustand for state management

### Backend
- Node.js (v18+)
- Express.js
- Firebase Admin SDK
- OpenAI API Integration
- Winston for logging
- PM2 for process management

### Database & Storage
- Firebase Firestore
- Firebase Authentication
- Firebase Storage

### AI & Machine Learning
- OpenAI GPT-4 API
- Custom MCP (Model Context Protocol) implementation
- Claude AI integration capabilities

### DevOps & Deployment
- AWS EC2 for hosting
- Nginx as reverse proxy
- PM2 for process management
- GitHub Actions for CI/CD

## Installation

### Prerequisites
1. Node.js (v18 or higher)
2. npm or yarn
3. Firebase account and project
4. OpenAI API key
5. AWS account (for deployment)

### Local Development Setup

1. **Clone the Repositories**
```bash
# Clone client repository
git clone https://github.com/Ritesh2351235/Omira.git
cd Omira

# Clone server repository
git clone https://github.com/Ritesh2351235/Omira-server.git
cd Omira-server

# Clone notification service repository
git clone https://github.com/Ritesh2351235/Omira-notification.git
cd Omira-notification
```

2. **Install Dependencies**
```bash
# Install client dependencies
cd omira/client
npm install

# Install server dependencies
cd ../../Omira-server
npm install

# Install notification service dependencies
cd ../Omira-notification
npm install
```

3. **Environment Configuration**

Client Environment (.env in client directory):
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_NOTIFICATION_URL=http://localhost:8001
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Server Environment (.env in Omira-server directory):
```env
PORT=8000
OPENAI_API_KEY=your_openai_api_key
FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json
LOG_LEVEL=info
NODE_ENV=development
```

Notification Service Environment (.env in Omira-notification directory):
```env
PORT=8001
FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json
LOG_LEVEL=info
NODE_ENV=development
```

4. **Start Development Servers**
```bash
# Start client (in client directory)
npm start

# Start main server (in Omira-server directory)
npm start

# Start notification service (in Omira-notification directory)
npm start
```

### Production Deployment

1. **Build the Client**
```bash
cd client
npm run build
```

2. **Deploy Servers on AWS EC2**
```bash
# Install PM2 globally
npm install -y pm2@latest -g

# Start the main server with PM2
cd ../Omira-server
pm2 start ecosystem.config.js --name omira-server

# Start the notification service with PM2
cd ../Omira-notification
pm2 start index.js --name omira-notification

# Save PM2 process list and configure startup
pm2 save
pm2 startup systemd
```

3. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        root /path/to/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /notifications {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for their powerful AI models
- The amazing open-source community
- All our contributors and supporters

---

<div align="center">
  Made with love by the Omira Team
  
  [Website](https://omira.ai) • [Twitter](https://twitter.com/omira_ai) • [Discord](https://discord.gg/omira)
</div>
