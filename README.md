# Vehicle Security Intelligence

A comprehensive platform for vehicle security monitoring, license plate recognition, facial recognition, accident detection, and security intelligence.

![Vehicle Security Intelligence Dashboard](https://i.imgur.com/Mxxhzd8.png)

## Project Overview

Vehicle Security Intelligence is a next-generation system designed to enhance traffic monitoring, vehicle tracking, and public safety. The platform combines advanced AI capabilities with a modern user interface to provide law enforcement and security personnel with real-time insights and powerful investigative tools.

## Key Features

- **Modern Dashboard**: Interactive data visualization with real-time statistics
- **License Plate Recognition**: Scan and search vehicle plates with camera integration
- **Facial Recognition**: Detect and match faces against criminal database
- **Accident Detection**: AI-powered accident monitoring with video analysis
- **Alerts Management**: Real-time notifications for various security events
- **Vehicle Database**: Comprehensive tracking and management of vehicle information
- **Reports & History**: Generate detailed reports and access historical data
- **Admin Panel**: User management, system settings, and security controls

## Tech Stack

### Frontend

- **React**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Router**: Client-side routing
- **Lucide Icons**: Beautiful, consistent icon set
- **Vite**: Fast, modern frontend build tool

### Backend

- **Node.js**: JavaScript runtime for backend services
- **Express**: Web framework for API development
- **JWT Authentication**: Secure user authentication and authorization
- **RESTful API**: Standard interface for client-server communication

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vehicle-security-intelligence.git
   cd vehicle-security-intelligence
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev:all
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
├── client/                # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # UI components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions
│       ├── pages/         # Application pages
│       └── App.tsx        # Main application component
├── server/                # Backend Express application
│   ├── controllers/       # Request controllers
│   ├── middlewares/       # Express middlewares
│   ├── routes/            # API route definitions
│   └── index.js           # Entry point
└── package.json           # Project dependencies and scripts
```

## Usage

### Demo Credentials

- **Email**: admin@example.com
- **Password**: password

### Main Features Walkthrough

1. **Dashboard**: Access analytics and key metrics
2. **License Plate Scanner**: Scan plates via camera or upload images
3. **Facial Recognition**: Match faces against database with real-time camera feed
4. **Accident Detection**: Monitor areas for incidents and analyze uploaded footage
5. **Alerts**: View and manage security notifications
6. **Vehicles**: Search and track vehicles in the database
7. **Reports & History**: Generate reports and view historical data
8. **Admin Panel**: Manage users, system settings, and security controls

## Deployment

This application can be easily deployed using Vercel:

1. Fork/clone this repository
2. Import it into your Vercel account
3. Configure environment variables if needed
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Shadcn/UI for the excellent component library
- Lucide Icons for the beautiful icon set
- All open-source libraries used in this project 