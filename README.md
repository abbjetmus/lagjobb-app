# Lagjobb App

Hjälper Sveriges föreningar genom att låta dem hjälpa dig!

## Tech Stack

- **Framework**: Quasar Framework v2 (Vue 3)
- **Language**: TypeScript
- **State Management**: Pinia
- **Backend**: PocketBase
- **Maps**: Google Maps (vue3-google-map)
- **Authentication**: PocketBase Auth

## Project Setup

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PocketBase instance running

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PB_URL=http://localhost:8090
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Start the app in development mode

```bash
npm run dev
```

### Build the app for production

```bash
npm run build
```

## PocketBase Setup

This app requires a PocketBase backend. You need to set up the following collections:

### Collections

1. **users** (default auth collection)
   - name (text)
   - phone (text)
   - locationId (relation to locations)

2. **uppdrag** (assignments)
   - creatorId (relation to users)
   - name (text)
   - email (email)
   - phone (text)
   - contactHours (text)
   - hidePhone (bool)
   - title (text)
   - description (text)
   - price (number)
   - desiredDate (date)
   - desiredTime (text)
   - desiredNumberOfPeople (number)
   - estimatedHours (number)
   - locationId (relation to locations)
   - images (file, multiple)
   - types (json)
   - status (text)

3. **groups**
   - name (text)
   - description (text)
   - groupTypeId (number)
   - creatorId (relation to users)
   - locationId (relation to locations)
   - contactEmail (email)
   - contactPhone (text)
   - images (file, multiple)
   - workers (json)
   - verified (bool)

4. **locations**
   - street (text)
   - city (text)
   - postalCode (text)
   - county (text)
   - lat (number)
   - lng (number)

5. **categories**
   - name (text)
   - label (text)
   - value (text)
   - color (text)

6. **uppdrag_types**
   - name (text)
   - categoryId (relation to categories)
   - label (text)
   - value (text)

7. **cities**
   - name (text)
   - countyId (relation to counties)
   - label (text)
   - value (text)

8. **counties**
   - name (text)
   - label (text)
   - value (text)
   - color (text)

9. **interest_messages**
   - uppdragId (relation to uppdrag)
   - userId (relation to users)
   - groupId (relation to groups)
   - message (text)
   - status (text)

10. **user_settings**
    - userId (relation to users)
    - autofillName (bool)
    - autofillEmail (bool)
    - autofillPhone (bool)
    - autofillStreet (bool)
    - autofillPostalCode (bool)
    - autofillCity (bool)
    - interestMessageNotification (bool)
    - uppdragCreatedNotification (bool)

## Features

- User authentication (sign up, sign in, password reset)
- Create and manage assignments (uppdrag)
- Create and manage groups (lag, klasser, föreningar)
- Search for assignments by type and location
- Google Maps integration for location selection and display
- Interest messages system
- User settings and preferences
- Responsive design for mobile and desktop

## Project Structure

```
src/
├── assets/          # Static assets (images, etc.)
├── boot/            # Boot files (PocketBase setup)
├── components/      # Reusable Vue components
├── layouts/         # Layout components
├── models/          # TypeScript models/interfaces
├── pages/           # Page components
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
└── css/             # Global styles
```

## License

Copyright © 2025 Lagjobb
