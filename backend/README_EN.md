# RuknApp Backend

This is the backend server for **RuknApp**, used to search for smart locations. It provides API endpoints to obtain smart location recommendations based on the type of business.

## Setup

### System Requirements

- Node.js (version 14 or later)
- npm or yarn

### Steps

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in the `backend` folder and add the following:

```
PORT=3000
SUPABASE_URL=https://cycncelsoqthdpabozhk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y25jZWxzb3F0aGRwYWJvemhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDgxMTAsImV4cCI6MjA1ODMyNDExMH0.taUNLQcBAB9p3bRyF-kbHttGibDtFJzqKiXxVl_mAJ0
```

3. Run the server:

```bash
npm start
```

For development with automatic reload:

```bash
npm run dev
```

## Available API Endpoints

### Get location recommendations

```
GET /api/recommendations/:businessType?count=5
```

Example:
```
GET /api/recommendations/barber?count=5
```

Returns the best 5 areas to open a barber shop.

### Get supported business types

```
GET /api/business-types
```

### Check database connection status

```
GET /api/status
```

## Algorithm

The algorithm uses the following weights to evaluate areas:

- **w_pop**: weight for the area's popularity
- **w_rat**: weight for user ratings
- **w_comp**: weight for competition level (negative weight)

Supported business types:

- barber (Barbershop)
- gym (Gym)
- gas_station (Gas station)
- laundry (Laundry service)
- pharmacy (Pharmacy)
- supermarket (Supermarket)

