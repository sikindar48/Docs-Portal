---
id: overview
title: NS Software Solutions - Overview
---

# NS Software Solutions Website

NS Software Solutions is a full-stack marketplace platform for BTech, MCA, and MTech students to discover, request, and receive academic projects with complete source code, comprehensive documentation, and professional support.

**Live Site:** [https://www.nssoftwaresolutions.in](https://www.nssoftwaresolutions.in)  
**Last Updated:** April 29, 2026  
**Status:** Production — Security Hardened

## Platform Overview

The website serves as a comprehensive project marketplace connecting students with over 100+ pre-built academic projects across multiple domains. Users can browse, request, purchase, and receive project deliverables including source code, documentation, and support.

### Key Statistics

| Metric | Value |
|--------|-------|
| **Version** | 1.0.0 (Production) |
| **Total Projects** | 100+ curated projects |
| **Domains** | 5+ (ML, Python, PHP, Blockchain, Deep Learning) |
| **User Roles** | 3 (Guest, User, Admin) |
| **Database Tables** | 12 core + extensions |
| **API Endpoints** | PostgREST auto-generated (50+) |
| **Lighthouse Score** | 85+ |

## Target Users

- **Students:** BTech, MCA, MTech students seeking final year projects
- **Professionals:** Developers, consultants, and researchers
- **Institutions:** Educational organizations using projects for curriculum

## Core Features

### For Guests
- Browse 100+ projects with dynamic filtering
- Search by domain, price tier, technology, or keywords
- View detailed project information with screenshots
- Submit project inquiries via WhatsApp or Email
- Read educational blog posts
- Explore service offerings
- Access city-specific landing pages for local SEO

### For Registered Users
- All guest features plus:
- Dashboard with purchase history and stats
- My Projects section with download links
- Custom project request submission
- Profile management
- Session activity tracking
- Auto-logout after 30 minutes of inactivity

### For Administrators
- Complete CRM-style backend
- Project management (CRUD, SEO fields, screenshots)
- User management with activity tracking
- Purchase management and file delivery
- Request management (4 types: service, project, web, contact)
- Admin notifications with unread badge
- Audit logging of all admin actions
- Real-time activity monitoring

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18.3.1 |
| **Language** | TypeScript | 5.8.3 |
| **Build** | Vite | 5.4.19 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **UI Components** | shadcn/ui | Latest |
| **Animations** | Framer Motion | 12.23.24 |
| **Routing** | React Router | 6.30.1 |
| **State** | React Query | 5.83.0 |
| **Forms** | React Hook Form | 7.61.1 |
| **Database** | Supabase (PostgreSQL 15+) | Latest |
| **Auth** | Supabase Auth | JWT, PKCE |
| **Hosting** | Netlify | Latest |

## Architecture Overview

The application follows a modern React architecture with:

- **Client-side routing** using React Router with lazy loading
- **API-first design** using Supabase PostgREST
- **JWT authentication** with automatic token refresh
- **Row Level Security** for data isolation
- **Code splitting** for optimized bundle size
- **Responsive design** for mobile-first experience

## Key Workflows

### Public User (Guest)
1. Browse projects → Filter by domain/price/technology
2. View project details with screenshots
3. Submit inquiry via WhatsApp or Email
4. Receive contact from admin

### Registered User
1. Sign up with email/password
2. Dashboard shows purchase history and stats
3. Request custom projects or purchase pre-built projects
4. Download deliverables when admin marks complete
5. Track project progress with percentage indicator

### Administrator
1. Manage project catalog (add, edit, delete, screenshots)
2. Review and respond to all incoming requests
3. Create and track purchases for users
4. Attach source code, documentation, videos
5. Monitor user activity and maintain audit logs

## Platform Highlights

- **100+ Projects** curated across ML, Python, PHP, Blockchain, Deep Learning domains
- **Dynamic Filtering** by domain, price tier, technology stack, and IEEE certification
- **Real-time Search** across title, description, and technology tags
- **WhatsApp Integration** for click-to-chat project inquiries
- **Admin CRM** with request management, purchase tracking, and file delivery
- **SEO Optimized** with dynamic meta tags, structured data, and city landing pages
- **Mobile Responsive** with touch-friendly interface and optimized performance
- **Secure** with email/password auth, JWT tokens, and Row Level Security

## Quick Navigation

import DocCardList from '@theme/DocCardList';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem'}}>

<div style={{padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>

**⚡ [Quick Start](/docs/ns-website/quick-start)**
Get up and running in 5 minutes with basic setup and testing

</div>

<div style={{padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>

**🔧 [Installation Guide](/docs/ns-website/installation)**
Complete step-by-step installation for all operating systems

</div>

<div style={{padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>

**🏗️ [System Architecture](/docs/ns-website/architecture)**
Technical architecture, routing, authentication, and state management

</div>

<div style={{padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>

**🗄️ [Database Schema](/docs/ns-website/database-schema)**
Complete database documentation with 12 tables and ERD diagrams

</div>

<div style={{padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>

**🎯 [Features & Workflows](/docs/ns-website/features-and-workflows)**
Guest, user, and admin workflows with complete feature breakdowns

</div>

</div>

