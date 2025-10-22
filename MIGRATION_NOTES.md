# Migration Notes: Lagjobb to Lagjobb-App

## Overview

This document describes the migration from the old Quasar v1/Vue 2 app to the modern Quasar v2/Vue 3 app with TypeScript.

## Key Changes

### Technology Stack

| Old Stack | New Stack |
|-----------|-----------|
| Quasar v1 | Quasar v2 |
| Vue 2 | Vue 3 |
| JavaScript | TypeScript |
| Vuex | Pinia |
| Firebase Auth | PocketBase |
| .NET API | PocketBase |
| Leaflet | Google Maps (vue3-google-map) |

### Architecture Changes

1. **Composition API**: All components use Vue 3's Composition API with `<script setup>`
2. **TypeScript**: Strongly typed models, stores, and components
3. **Pinia**: Replaced Vuex for state management
4. **PocketBase**: Single backend solution for auth and data

### Component Migrations

- **MainLayout**: Migrated to Composition API, updated auth handling
- **IndexPage**: Search functionality maintained with new reactive patterns
- **Auth Components**: SignInSignUpDialog uses PocketBase auth
- **Map Components**: Replaced Leaflet with Google Maps

### Store Structure

```
stores/
├── auth.ts          # Authentication (PocketBase)
├── data.ts          # Categories, cities, counties
└── settings.ts      # User preferences
```

### Models

TypeScript interfaces for:
- User
- Uppdrag (Assignment)
- Group
- Location
- Category
- InterestMessage

## Missing Features

The following features from the old app need implementation:

1. **Image Upload**: File handling for uppdrag and groups
2. **Edit Functionality**: Edit pages for uppdrag and groups
3. **Saved Uppdrag**: Bookmark/save functionality
4. **Advanced Search**: Filters and sorting
5. **Notifications**: Push notifications system
6. **Payment Integration**: Swish/payment processing
7. **Email Verification**: Email verification flow
8. **Password Reset**: Complete password reset flow

## PocketBase Setup Required

Before the app can function, you need to:

1. Set up PocketBase collections (see README.md)
2. Configure collection rules and permissions
3. Seed initial data (categories, counties, cities)
4. Set up file storage for images

## Environment Setup

Required environment variables:
- `PB_URL`: PocketBase server URL
- `GOOGLE_MAPS_API_KEY`: Google Maps API key

## Known Issues

1. Some pages are placeholders (Edit pages, Shop, etc.)
2. Image upload not implemented
3. Email verification needs completion
4. Search filters could be more advanced
5. No real-time updates (could use PocketBase realtime)

## Next Steps

1. Set up PocketBase backend
2. Implement image upload functionality
3. Add edit functionality for uppdrag and groups
4. Implement saved uppdrag feature
5. Add email templates and verification
6. Set up payment integration
7. Implement push notifications
8. Add real-time features using PocketBase subscriptions
9. Add comprehensive error handling
10. Add loading states and skeletons
11. Implement advanced search and filters
12. Add data validation and form validation
13. Set up analytics and monitoring
14. Add SEO meta tags
15. Implement progressive web app features

## Testing Checklist

- [ ] User registration and login
- [ ] Create uppdrag
- [ ] Create group
- [ ] Search functionality
- [ ] Interest messages
- [ ] Settings management
- [ ] Mobile responsiveness
- [ ] Google Maps integration
- [ ] Protected routes
- [ ] Logout functionality

## Performance Considerations

- Lazy load routes
- Optimize images
- Implement pagination for lists
- Add caching strategies
- Consider server-side rendering for SEO

## Security Considerations

- Validate all user input
- Implement proper PocketBase rules
- Secure API keys
- Add rate limiting
- Implement CSRF protection
- Add input sanitization

