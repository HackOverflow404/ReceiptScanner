# SmartSplit
A React Native mobile application for splitting expenses with friends and family. Scan receipts, automatically parse line items, and seamlessly divide costs among group members.

## Features
- Smart Receipt Scanning - Point your camera at any receipt for instant OCR processing
- Automatic Parsing - AI-powered extraction of merchant info, items, prices, and totals
- Group Expense Management - Create groups and split bills with multiple people
- Flexible Splitting - Split equally, by percentage, or assign specific items to individuals
- Expense Tracking - View spending history and outstanding balances
- Real-time Sync - Keep expenses updated across all group members' devices
- Payment Integration - Send payment reminders and track settlements
- Cross-Platform - Available for both iOS and Android

# Tech Stack
- Frontend: React Native
- Receipt OCR: Google ML Kit + Veryfi or Klippa API fallback
- Image Processing: React Native Image Picker + Vision Camera
- UI Components: React Native Elements
- Testing: Jest + React Native Testing Library

# Todo
- Come up with backend design
  - Firebase vs Supabase vs Other option (considering postgres or something)
- Create Balances Page
- Create Scan Page
- Figure out Receipt Scanning
  - Test Veryfi and Klippa
  - Image quality preprocessing
  - Validation logic
  - Offline capability