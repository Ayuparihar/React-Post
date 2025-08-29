# Simple React Posts Dashboard

## Overview

This is a client-side React application that displays posts from the JSONPlaceholder API in a paginated dashboard format. The application fetches blog posts and presents them in a clean, modern interface with loading states and error handling. It's built as a simple single-page application using React hooks and Context API for state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 using CDN imports (no build process)
- **JSX Compilation**: Babel Standalone for in-browser JSX transformation
- **State Management**: React Context API with hooks (useState, useEffect, useContext)
- **Component Structure**: Provider pattern with PostsContext for global state management
- **Styling**: Pure CSS with modern design patterns and responsive layout

### Data Flow
- **API Integration**: Fetches data from JSONPlaceholder API (fake REST API for testing)
- **Pagination Logic**: Client-side pagination displaying 6 posts per page
- **Loading Strategy**: Implements artificial 5-second loading delay for demonstration
- **Error Handling**: Basic error states with user-friendly messages

### UI/UX Design
- **Design System**: Clean, modern interface using Inter font family
- **Color Scheme**: Neutral grays with white backgrounds for readability
- **Layout**: Flexbox-based responsive design with max-width constraints
- **Loading States**: Visual feedback during data fetching operations

### File Structure
- `index.html`: Entry point with React CDN imports and Babel configuration
- `App.js`: Main React application with context provider and component logic
- `style.css`: Complete styling with reset, component styles, and responsive design

## External Dependencies

### Third-Party Services
- **JSONPlaceholder API**: `https://jsonplaceholder.typicode.com/posts` - Provides fake blog post data for testing and prototyping

### CDN Dependencies
- **React 18**: Core React library from unpkg CDN
- **React DOM 18**: React DOM rendering library from unpkg CDN  
- **Babel Standalone**: In-browser JSX compilation from unpkg CDN

### Font Resources
- **Inter Font**: Modern system font stack with fallbacks to system UI fonts