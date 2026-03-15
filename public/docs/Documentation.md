Voxy
Technical Documentation and Task Assignment

Project Overview

Voxy is a multilingual AI voice assistant designed to help small businesses respond to customer inquiries automatically. Many customers communicate using voice notes or informal text in languages such as English, Pidgin, or Yoruba. The system converts voice messages to text, processes the request using an AI model, and generates a response that the business can send back to the customer.

The first version of the product will be a web based dashboard where businesses can interact with the assistant, test responses, and manage conversations.

Technology Stack

Frontend
Next.js using JSX
TailwindCSS for styling
shadcn UI components
Zustand for state management

Backend
Node.js
Express.js REST API

Database
PostgreSQL

AI Layer
Gemini API or Mistral API

System Architecture

The application consists of three major layers.

Frontend Layer

The frontend is built using Next.js and provides the user interface for business owners. It contains the dashboard, assistant interface, conversation management system, and configuration pages.

Backend Layer

The backend is built using Node.js and Express. It exposes REST APIs that handle authentication, AI processing, business configuration, conversation storage, and analytics.

AI Processing Layer

The AI layer receives a customer message, processes it using a language model, and generates an appropriate response based on business context and supported languages.

Database Layer

PostgreSQL stores user accounts, business profiles, conversation logs, voice transcripts, and analytics data.

Application Structure

Frontend Pages

Landing Page
Purpose: Introduce the product and allow users to sign up.

Login Page
Purpose: Allow existing users to log into their dashboard.

Register Page
Purpose: Allow new users to create an account.

Dashboard Page
Purpose: Provide a quick overview of usage and activity.

Assistant Page
Purpose: Main interface where users interact with the AI assistant.

Conversations Page
Purpose: Display conversation history and transcripts.

Analytics Page
Purpose: Show statistics related to conversations and usage.

Business Page
Purpose: Configure business information that the AI will use as context.

Languages Page
Purpose: Configure supported languages for the AI assistant.

Settings Page
Purpose: Manage account details and security settings.

Backend Modules

Authentication Module
Handles login, registration, and user sessions.

Assistant Module
Processes text or voice messages and generates AI responses.

Conversation Module
Stores and retrieves conversation history.

Business Module
Stores business configuration data.

Analytics Module
Tracks conversation activity and usage patterns.

Database Schema

Users Table

id
name
email
password
created_at

Businesses Table

id
user_id
business_name
industry
description
created_at

Conversations Table

id
business_id
customer_message
ai_response
language
created_at

Voice Logs Table

id
conversation_id
audio_url
transcript

Analytics Table

id
business_id
query_count
language_usage

API Endpoints

Authentication

POST /auth/register
POST /auth/login

Assistant

POST /assistant/message
POST /assistant/voice

Business

GET /business
POST /business/update

Conversations

GET /conversations
GET /conversations/:id

Analytics

GET /analytics

Development Task Assignment

Team Structure

Project Lead and Backend Engineer
SAMKIEL

Full Stack Engineer
Tobi

Frontend UI Engineer
Abraham

SAMKIEL leads the overall system architecture and backend development. He is responsible for designing the technical structure of the platform, implementing the AI processing pipeline, and managing the core backend APIs.

Tobi works as a full stack engineer responsible for implementing major features across both the frontend and backend. He connects frontend pages to backend APIs and builds functional systems such as conversations, analytics logic, and business configuration handling.

Abraham focuses on frontend UI design and visual interface implementation. His role is to ensure the application has a clean and responsive interface using Tailwind and shadcn components. He will handle layout design and reusable UI components across pages.

SAMKIEL Responsibilities

System Architecture

Design the full project architecture
Define backend service structure
Setup Node and Express backend server
Configure PostgreSQL database connection
Design API structure and request flow

Backend Development

Implement authentication APIs
Implement assistant processing API
Implement conversation storage logic
Integrate AI model API (Gemini or Mistral)
Create voice processing pipeline

Pages and Features Owned by SAMKIEL

Assistant Page backend logic
Authentication logic for Login and Register pages
Conversation API endpoints
AI processing pipeline for the Assistant feature

Additional Tasks

Voice to text processing integration
AI prompt engineering and response formatting
Database schema implementation
Performance and backend optimization

Tobi Responsibilities

Full Stack Feature Development

Implement functional features across frontend and backend
Connect frontend pages to backend APIs
Handle data flow between UI and backend services

Pages Assigned to Tobi

Login Page
Register Page
Assistant Page functionality
Conversations Page
Languages Page
Settings Page

Backend Features Assigned to Tobi

Conversation retrieval APIs
Language configuration endpoints
Settings update endpoints
Analytics data retrieval APIs

Components Owned by Tobi

Chat interface logic
Voice recording feature
Conversation list and message viewer
Language selection system
Settings management forms

Additional Tasks

Ensure frontend pages communicate correctly with backend services
Handle error states and loading states
Implement API integrations for frontend features

Abraham Responsibilities

Frontend UI and Design

Design the visual interface of the application
Implement responsive layouts using TailwindCSS
Create reusable UI components using shadcn UI

Pages Assigned to Abraham

Landing Page
Dashboard Page
Analytics Page
Business Configuration Page

Components Owned by Abraham

Navigation sidebar
Dashboard statistic cards
Analytics display components
Business configuration form UI
Header and layout components

Additional Tasks

Ensure consistent design across all pages
Implement responsive design for mobile and tablet
Improve visual usability and layout clarity
Apply spacing, typography, and UI polish across the platform

Development Workflow

SAMKIEL focuses on backend systems and AI processing.
Tobi builds full features by connecting frontend pages to backend APIs.
Abraham focuses on UI structure, design consistency, and frontend layout.

kindly reach out if you get issue with your task..
