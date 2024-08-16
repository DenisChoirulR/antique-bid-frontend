# Antique-Bid Frontend

AntiqueBid Frontend is the user interface for the AntiqueBid auction application. This frontend is built using React and Tailwind CSS, providing an intuitive and responsive experience for users to browse, bid, and manage antique items.

## Installation

### Clone the Repository

```bash
git clone https://github.com/DenisChoirulR/antique-bid-frontend.git
cd antique-bid-frontend
```

### Install Dependencies
```bash
npm install
```

## Running the Application

To run the frontend application, you need to make sure the backend server is up and running first. The frontend relies on the backend for API requests, so the Vite configuration is set to proxy API calls to `http://127.0.0.1:8000`.

### Backend Setup

1. Start the backend server (AntiqueBid Backend) on `http://127.0.0.1:8000`.

2. If your backend is running on a different URL or port, update the `vite.config.js` file accordingly:

   ```javascript
   // vite.config.js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': {
           target: 'http://127.0.0.1:8000', // Change this to match your backend URL
           changeOrigin: true,
         }
       }
     }
   })
   ```

3. Start the frontend application:
   ```bash
   npm run dev
   ```

### Credentials
The database seeder creates two roles: Admin and Regular users.

Admin Credentials:
admin1@example.com / admin1
admin2@example.com / admin2

Regular User Credentials:
user1@example.com / user1
user2@example.com / user2
