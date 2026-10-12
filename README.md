# Property Management Application (HavenEstate)

A full-stack, production-quality property management platform built with Spring Boot, Spring Security, JWT, PostgreSQL, Flyway, React, Vite, and Tailwind CSS.

---

## 1. Project Overview & Architecture

HavenEstate is architected as a modular, decoupled full-stack platform:
- **`backend/`**: Java Spring Boot 3 REST API with stateless JWT authentication, role-based access control (`ROLE_USER`, `ROLE_ADMIN`), Flyway schema migrations, PostgreSQL database persistence, and isolated filesystem image storage with traversal defenses.
- **`frontend/`**: Modern React 19 single-page application built with Vite, Tailwind CSS, React Router, and Axios. Features role-aware navigation, interactive property galleries, geolocation-based city filtering with fallbacks, and an admin management suite.

```text
├── backend/
│   ├── .mvn/wrapper/                  # Maven wrapper configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/property/management/
│   │   │   │   ├── config/            # Security, CORS, JWT & storage configurations
│   │   │   │   ├── controller/        # REST API endpoints (Auth, Properties, Admin)
│   │   │   │   ├── dto/               # Request and response Data Transfer Objects
│   │   │   │   ├── entity/            # JPA Entities (User, Property, PropertyImage)
│   │   │   │   ├── exception/         # Centralized error handler and custom exceptions
│   │   │   │   ├── repository/        # Spring Data JPA repositories
│   │   │   │   ├── security/          # JWT filters, UserDetails, and auth handlers
│   │   │   │   ├── service/           # Business logic, file storage, geolocation
│   │   │   │   └── PropertyManagementApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml    # Externalized configuration with env fallbacks
│   │   │       ├── application-local.yml
│   │   │       └── db/migration/      # Flyway SQL migrations
│   │   └── test/                      # Spring Boot & unit/integration tests
│   ├── pom.xml                        # Maven dependencies & build definitions
│   ├── mvnw.cmd / mvnw                # Cross-platform Maven wrappers
│   └── .env.example                   # Backend environment template
├── frontend/
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── api/                       # Axios client & JWT interceptors
│   │   ├── components/                # Reusable UI components (Navbar, Modal, etc.)
│   │   ├── context/                   # AuthContext & global state
│   │   ├── pages/                     # Routed pages (Home, Detail, Login, Admin)
│   │   ├── routes/                    # Protected route guards
│   │   ├── App.jsx                    # Root view & route orchestration
│   │   ├── index.css                  # Tailwind styles and design tokens
│   │   └── main.jsx                   # React entry point
│   ├── package.json                   # React, Vite, Tailwind, Axios dependencies
│   ├── vite.config.js                 # Vite bundler & API proxy configuration
│   ├── tailwind.config.js             # Luxury brand tokens & styling utilities
│   └── .env.example                   # Frontend environment template
├── .gitignore                         # Project-wide ignore rules
└── README.md                          # Application documentation
```

---

## 2. Technology Stack

- **Backend**: Java 17+, Spring Boot 3.3.5, Spring Security 6, JJWT 0.12.6, Spring Data JPA, Hibernate, Bean Validation, Flyway Migrations, Maven.
- **Frontend**: React 19, Vite 8, Tailwind CSS 3.4, React Router, Axios, Lucide React.
- **Database**: PostgreSQL with Flyway database migrations (H2 for automated slice testing).
- **Deployment**: Vercel (Frontend), Render (Backend), PostgreSQL (Managed Database with env configuration), Server-side Persistent Storage for property images.

---

## 3. Development Phases

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Project structure and configuration | **COMPLETED** |
| **Phase 2** | Database entities, repositories, services, migrations and REST APIs (Domain, DB, DTOs & Validation) | **COMPLETED** |
| **Phase 3** | Registration, login, JWT and role-based security | **COMPLETED** |
| **Phase 4** | Property CRUD, image uploads, city filtering, Atomic Design & Postman deliverables | **COMPLETED** |
| **Phase 5** | Complete Frontend Implementation (Atomic Design, Auth, Public Listings, Admin & Postman Newman verified) | **COMPLETED** |
| **Phase 6** | End-to-End Integration, Security Audit, Inquiries Desk & Final Quality Assurance | **COMPLETED** |
| **Phase 7** | Production Deployment Preparation & Multi-Cloud Infrastructure (Vercel + Render) | **DEPLOYMENT READY** |

---

## 4. Authentication, Authorization & Initial Administrator Provisioning

### A. Authentication & JWT Architecture
- **Stateless JWT**: Standardized on HMAC-SHA256 tokens using the latest JJWT library (`0.12.6`). Tokens contain subject (email), user ID (`userId`), and authority (`role`: `ROLE_USER` or `ROLE_ADMIN`).
- **Passswords**: Hashed using BCrypt with a cost factor (strength) of 12.
- **Role-Based Access Control (RBAC)**:
  - Public registration (`POST /api/auth/register`) strictly assigns `Role.USER`. Any client-supplied role parameters are ignored to eliminate privilege escalation vectors.
  - Administrative endpoints (`/api/admin/**`) strictly require `ROLE_ADMIN`.
  - Identity is derived on the backend from `SecurityContextHolder` / authenticated principal, never trusted from client request parameters.
- **Frontend Token Header**: Subsequent authenticated requests from the frontend must include:
  ```http
  Authorization: Bearer <your_jwt_token_here>
  ```

### B. Secure Initial Administrator Provisioning
The initial administrator is provisioned automatically and idempotently on application startup by `AdminBootstrapRunner`:
1. Provide `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` via environment variables.
2. If both variables are omitted, bootstrap is skipped cleanly.
3. If an administrator account already exists in PostgreSQL, bootstrap is skipped to preserve existing administrative credentials.
4. If an ordinary user already exists with that email, the runner logs a warning and **refuses** to silently promote them, ensuring strict role integrity.
5. The password is never printed in log files and is immediately hashed using BCrypt.

---

## 5. API Contracts & Example Requests

### 1. Register User (`POST /api/auth/register`)
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "fullName": "Jane Doe"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "email": "jane@example.com",
      "fullName": "Jane Doe",
      "role": "USER",
      "createdAt": "2026-10-12T08:08:00Z"
    },
    "timestamp": "2026-10-12T08:08:00Z"
  }
  ```

### 2. Login User (`POST /api/auth/login`)
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "tokenType": "Bearer",
      "expiresIn": 86400000,
      "user": {
        "id": 1,
        "email": "jane@example.com",
        "fullName": "Jane Doe",
        "role": "USER",
        "createdAt": "2026-10-12T08:08:00Z"
      }
    },
    "timestamp": "2026-10-12T08:08:05Z"
  }
  ```

### 3. Current User Profile (`GET /api/auth/me`)
- **Headers**:
  ```http
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": {
      "id": 1,
      "email": "jane@example.com",
      "fullName": "Jane Doe",
      "role": "USER",
      "createdAt": "2026-10-12T08:08:00Z"
    },
    "timestamp": "2026-10-12T08:08:10Z"
  }
  ```

### 4. Public Properties (`GET /api/properties`)
- **Query Parameters**:
  - `page`: 0-indexed page number (default: `0`)
  - `size`: items per page (default: `10`, max: `100`)
  - `city`: case-insensitive city search filter (optional)
  - `search`: title or description keyword search (optional)
  - `sortBy`: `createdAt`, `price`, `name`, `city` (default: `createdAt`)
  - `sortDir`: `asc`, `desc` (default: `desc`)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": {
      "content": [
        {
          "id": 1,
          "name": "Oceanfront Luxury Villa",
          "description": "Breathtaking ocean views and private beach access.",
          "price": 1250000.00,
          "location": "100 Ocean Drive",
          "city": "Miami",
          "primaryImagePath": "uploads/properties/a1b2c3d4.jpg",
          "images": [
            {
              "id": 1,
              "fileName": "a1b2c3d4.jpg",
              "filePath": "uploads/properties/a1b2c3d4.jpg",
              "contentType": "image/jpeg",
              "fileSize": 204800,
              "isPrimary": true,
              "displayOrder": 0,
              "createdAt": "2026-10-12T08:15:00Z"
            }
          ],
          "createdAt": "2026-10-12T08:15:00Z",
          "updatedAt": "2026-10-12T08:15:00Z"
        }
      ],
      "currentPage": 0,
      "pageSize": 10,
      "totalElements": 1,
      "totalPages": 1,
      "first": true,
      "last": true,
      "empty": false
    },
    "timestamp": "2026-10-12T08:15:05Z"
  }
  ```

### 5. Admin Create Property (`POST /api/admin/properties`)
- **Headers**:
  ```http
  Authorization: Bearer <adminToken>
  Content-Type: multipart/form-data
  ```
- **Multipart Form Fields**:
  - `name`: string (2-150 chars)
  - `description`: string (10-4000 chars)
  - `price`: decimal (greater than 0, max 2 decimal places)
  - `location`: string (3-255 chars)
  - `city`: string (2-100 chars)
  - `images`: file parts (multiple JPEG, PNG, or WebP files)
- **Response**: `201 Created` with full property envelope.

---

## 6. Secure Image Management & Persistent Storage

- **Isolated File Storage**: Binary image contents are NEVER stored in PostgreSQL. They are streamed to disk at `storage.location` (default `uploads/properties`).
- **Path Traversal Protection**: Filenames are sanitized via `StringUtils.cleanPath()`, validated with `Path.normalize()`, and strictly checked to ensure paths remain inside the configured root directory.
- **UUID Naming**: Files are renamed with unique UUIDs (`<uuid>.<ext>`) to prevent collisions and malicious filename spoofing.
- **Magic-Byte Content Inspection**: In addition to declared MIME headers, files are inspected by byte header:
  - JPEG: `FF D8 FF`
  - PNG: `89 50 4E 47`
  - WebP: `RIFF....WEBP`
- **Cascade Deletion**: When a property is deleted via `DELETE /api/admin/properties/{id}`, database records are cascaded via foreign keys and physical image files are deleted from disk.
- **Production Storage Requirements**:
  - For Render / containerized deployment, mount a persistent volume disk at `/var/data/properties` and set `STORAGE_LOCATION=/var/data/properties`.
  - Alternatively, configure an S3 / cloud blob storage adapter implementing the storage contract for horizontally scalable deployments.

---

## 7. Frontend Atomic Design Architecture

The React frontend strictly adheres to **Atomic Design** principles:

```text
frontend/src/
├── assets/                    # Static branding, SVGs, icons
├── components/
│   ├── atoms/                 # Button, Input, Label, Badge, Spinner, Modal primitives
│   ├── molecules/             # FormField, SearchBar, Pagination, ImagePreview, PropertyPrice
│   ├── organisms/             # Navbar, PropertyCard, PropertyGrid, PropertyForm, PropertyTable, ImageUploader
│   └── templates/             # PublicLayout, AuthLayout, AdminLayout
├── pages/
│   ├── auth/                  # LoginPage, RegisterPage
│   ├── properties/            # PropertyListingPage, PropertyDetailsPage
│   └── admin/                 # AdminPropertyListPage, AdminPropertyCreatePage, AdminPropertyEditPage
├── layouts/                   # Layout wrappers
├── routes/                    # PublicRoute, ProtectedRoute, AdminRoute guards
├── services/                  # api.js (Axios client with JWT interceptor), authApi.js, propertyApi.js
├── hooks/                     # useAuth, usePagination, useProperties, useAdminProperties
├── context/                   # AuthContext, UIContext
├── utils/                     # Formatting (currency, date), error parsers
├── constants/                 # API endpoints, roles, storage keys
├── validators/                # Form validation schemas
├── App.jsx                    # Application entry view & router
└── main.jsx                   # React 19 mount point
```

---

## 8. Postman Test Suite

A complete Postman collection and local environment are included in the repository under [`postman/`](file:///c:/Users/Acer/Documents/New%20folder/postman/):

- [`postman/Property-Management.postman_collection.json`](file:///c:/Users/Acer/Documents/New%20folder/postman/Property-Management.postman_collection.json): Complete collection covering Authentication, Public Properties, Admin CRUD, and Negative Tests with automated status code assertions and dynamic token capture scripts.
- [`postman/Property-Management-Local.postman_environment.json`](file:///c:/Users/Acer/Documents/New%20folder/postman/Property-Management-Local.postman_environment.json): Environment variables (`baseUrl`, `jwtToken`, `adminToken`, `propertyId`, `testPropertyId`).
- [`postman/README.md`](file:///c:/Users/Acer/Documents/New%20folder/postman/README.md): Detailed import guide, execution workflow, and CLI execution instructions via Newman.

---

## 9. Environment Variables

### Backend (`backend/.env`)
- `PORT`: HTTP port (default `8080`)
- `DB_URL`: PostgreSQL JDBC connection string (`jdbc:postgresql://localhost:5432/propertymanagement`)
- `DB_USERNAME`: Database username (`postgres`)
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: 256-bit secure secret key (min 32 bytes)
- `JWT_EXPIRATION_MS`: Token lifetime in ms (`86400000` = 24h)
- `STORAGE_LOCATION`: Directory path for persistent image uploads (`uploads/properties`)
- `STORAGE_MAX_FILE_SIZE`: Maximum image size in bytes (`10485760` = 10MB)
- `STORAGE_ALLOWED_MIME_TYPES`: Allowed MIME types (`image/jpeg,image/png,image/webp`)
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed frontend origins (`http://localhost:5173`)
- `INITIAL_ADMIN_EMAIL`: Email for the seeded bootstrap administrator
- `INITIAL_ADMIN_PASSWORD`: Password for the initial administrator

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL`: Backend API URL (default `http://localhost:8080`)
- `VITE_GEOCODING_PROVIDER`: Reverse-geocoding provider (`nominatim`)
- `VITE_GEOCODING_API_KEY`: API key if using commercial geocoding services

---

## 10. Production Deployment Guide (Vercel & Render)

HavenEstate is engineered for production deployment across **Vercel** (Frontend SPA) and **Render** (Spring Boot Backend + Managed PostgreSQL).

### A. Deployment Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Devices"]
        Browser["User / Admin Web Browser"]
    end

    subgraph Vercel ["Vercel Edge Network (Frontend)"]
        SPA["React 19 SPA (Vite)"]
        VercelConfig["vercel.json (SPA Routing & Cache-Control)"]
    end

    subgraph Render ["Render Cloud Platform (Backend)"]
        LB["Render TLS / HTTPS Reverse Proxy (Port 443 -> $PORT)"]
        SpringBoot["Spring Boot 3 REST API (Docker / Java 17)"]
        Disk["Render Persistent Disk (/var/data/havenestate/uploads)"]
    end

    subgraph Database ["Managed PostgreSQL"]
        PostgresDB[("PostgreSQL 18 Database\nFlyway Migrations V1 & V2")]
    end

    Browser -->|HTTPS Requests| SPA
    SPA -->|Axios REST / JWT Auth| LB
    LB --> SpringBoot
    SpringBoot -->|Read / Write Image Binaries| Disk
    SpringBoot -->|HikariCP / Connection Pooling| PostgresDB
```

---

### B. Production URLs & Target Endpoints

| Component | Provider | Target Production URL | Notes |
|:---|:---|:---|:---|
| **Frontend** | Vercel | `https://havenestate-frontend.vercel.app` | Configured with `vercel.json` SPA fallbacks |
| **Backend API** | Render | `https://havenestate-backend.onrender.com` | Exposes `/api/**` with CORS restricted to frontend |
| **Database** | Render / Cloud | `jdbc:postgresql://<host>:5432/propertymanagement` | Managed PostgreSQL with automatic Flyway V1/V2 |

*(Note: Replace with your actual custom domains once provisions are live).*

---

### C. Backend Deployment on Render

#### Option 1: 1-Click Blueprint (`render.yaml`)
1. Push this repository to GitHub / GitLab.
2. In the Render Dashboard, click **New +** $\rightarrow$ **Blueprint**.
3. Select the repository. Render will automatically detect `render.yaml` and provision:
   - Managed PostgreSQL Database (`havenestate-db`)
   - Web Service (`havenestate-backend`) with Docker runtime
   - Persistent Disk (`1 GB` mounted at `/var/data/havenestate/uploads`)

#### Option 2: Manual Web Service Setup
1. **Create Managed PostgreSQL Database**:
   - Name: `havenestate-db`
   - Database: `propertymanagement`
   - User: `havenestate_user`
   - Save the internal `Connection String` (e.g., `postgresql://havenestate_user:password@dpg-...-a/propertymanagement`).
2. **Create Web Service**:
   - Environment: **Docker**
   - Root Directory: `backend`
   - Dockerfile Path: `backend/Dockerfile`
   - Plan: **Starter** (requires paid tier for persistent disks)
3. **Attach Persistent Disk**:
   - Disk Name: `havenestate-uploads`
   - Mount Path: `/var/data/havenestate/uploads`
   - Size: `1 GB` (or higher as needed)
4. **Environment Variables**:
   ```ini
   SPRING_PROFILES_ACTIVE=prod
   PORT=8080
   STORAGE_LOCATION=/var/data/havenestate/uploads
   DB_URL=jdbc:postgresql://<render-db-host>:5432/propertymanagement?sslmode=require
   DB_USERNAME=havenestate_user
   DB_PASSWORD=<secure-generated-db-password>
   JWT_SECRET=<generate-min-32-bytes-secure-random-key>
   JWT_EXPIRATION_MS=86400000
   CORS_ALLOWED_ORIGINS=https://havenestate-frontend.vercel.app
   INITIAL_ADMIN_EMAIL=admin@havenestate.com
   INITIAL_ADMIN_PASSWORD=<strong-random-admin-password>
   ```

---

### D. Frontend Deployment on Vercel

1. In the Vercel Dashboard, click **Add New...** $\rightarrow$ **Project**.
2. Import the Git repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   ```ini
   VITE_API_BASE_URL=https://havenestate-backend.onrender.com
   ```
5. Deploy. The committed [`frontend/vercel.json`](file:///c:/Users/Acer/Documents/New%20folder/frontend/vercel.json) automatically enforces single-page application URL rewriting (`/(.*) -> /index.html`), ensuring browser refreshes on `/properties/:id`, `/login`, and `/admin/**` function flawlessly without 404 errors.

---

### E. Least-Privilege Production Database User Setup

Before going live, configure a dedicated, non-superuser role for the application in PostgreSQL:

```sql
-- 1. Create dedicated application role
CREATE ROLE havenestate_app WITH LOGIN PASSWORD 'YourSuperSecretDbPassword123!';

-- 2. Grant connection rights to target database
GRANT CONNECT ON DATABASE propertymanagement TO havenestate_app;

-- 3. Connect to propertymanagement and grant schema access
\c propertymanagement

GRANT USAGE ON SCHEMA public TO havenestate_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO havenestate_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO havenestate_app;

-- 4. Ensure future tables created by Flyway migrations inherit permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO havenestate_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO havenestate_app;
```

---

### F. Database Backup & Disaster Recovery Procedures

#### 1. Automated Backups
Render Managed PostgreSQL automatically provides daily automated snapshots with point-in-time recovery on paid tiers.

#### 2. Manual Backup (`pg_dump`)
Run a compressed schema & data dump before major application deployments:

```bash
pg_dump --format=custom --no-owner --no-privileges \
  --dbname="postgresql://<user>:<password>@<host>:5432/propertymanagement?sslmode=require" \
  --file="havenestate_backup_$(date +%Y%m%d_%H%M%S).dump"
```

#### 3. Safe Disaster Recovery Procedure (`pg_restore`)

> [!CAUTION]
> **Operational Realities of Database Restoration:**
> - **Planned Downtime Required**: Restoring and cutting over a database requires an announced maintenance window or taking the application into maintenance mode. Never claim a database swap is "zero-downtime" or "zero-loss": transactions accepted by production after the snapshot timestamp will not exist in the backup, and active connections must be severed to permit renaming.
> - **Prohibition of `--clean` on Live Databases**: Running `pg_restore --clean --if-exists` directly against active production executes `DROP TABLE ... CASCADE` before recreating objects. If the restore encounters corruption or constraint errors midway, existing tables are already dropped, resulting in catastrophic unrecoverable data loss.

Follow this controlled, non-destructive recovery workflow:

##### Step 1: Establish Maintenance Window & Halt Writes
1. Place the frontend into maintenance mode or stop/suspend the backend web service on Render to halt inbound traffic and drain HikariCP connection pools.
2. Note that any writes committed to the production database after the backup timestamp cannot be captured by the snapshot.

##### Step 2: Create an Isolated Recovery Database
Provision a separate staging database so the existing production database remains completely intact:
```bash
createdb -h <host> -U <postgres_user> propertymanagement_recovery
```

##### Step 3: Restore Snapshot into Recovery Database
Restore the snapshot into the recovery database using fail-fast flags without dropping active production data:
```bash
pg_restore --no-owner --no-privileges --exit-on-error \
  --dbname="postgresql://<user>:<password>@<host>:5432/propertymanagement_recovery?sslmode=require" \
  "havenestate_backup_YYYYMMDD_HHMMSS.dump"
```

##### Step 4: Verify Database Ownership & User Permissions
Ensure the application runtime user (`havenestate_app`) holds required privileges on the recovered schema and sequences:
```sql
GRANT CONNECT ON DATABASE propertymanagement_recovery TO havenestate_app;

\c propertymanagement_recovery
GRANT USAGE ON SCHEMA public TO havenestate_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO havenestate_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO havenestate_app;
```

##### Step 5: Validate Restored Data Integrity
Run verification queries against `propertymanagement_recovery` before touching production:
```bash
psql -h <host> -U <user> -d propertymanagement_recovery -c \
  "SELECT count(*) AS total_users FROM users; \
   SELECT count(*) AS total_properties FROM properties; \
   SELECT count(*) AS total_inquiries FROM inquiries; \
   SELECT version, installed_on, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"
```

##### Step 6: Controlled Cutover (Handling Active Connections)
PostgreSQL prevents renaming a database while any active client session remains connected (`ERROR: database "propertymanagement" is being accessed by other users`). Perform the cutover as follows:

1. Connect to the administrative `postgres` maintenance database:
   ```bash
   psql -h <host> -U <postgres_user> -d postgres
   ```
2. Prevent new incoming connections and terminate active sessions:
   ```sql
   -- Prevent new connection attempts during swap
   REVOKE CONNECT ON DATABASE propertymanagement FROM PUBLIC, havenestate_app;

   -- Terminate any remaining active sessions
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE datname = 'propertymanagement' AND pid <> pg_backend_pid();
   ```
3. Execute the database rename swap:
   ```sql
   ALTER DATABASE propertymanagement RENAME TO propertymanagement_pre_recovery;
   ALTER DATABASE propertymanagement_recovery RENAME TO propertymanagement;

   -- Restore connection rights for the application
   GRANT CONNECT ON DATABASE propertymanagement TO havenestate_app;
   ```
   *(Alternative Option: Instead of renaming the database, update the backend environment variable `DB_NAME=propertymanagement_recovery` in the Render dashboard and trigger a redeploy).*

##### Step 7: Resume Application Service & Validate Health
1. Start / unsuspend the backend web service on Render.
2. Verify startup logs show successful Flyway validation and HikariCP connection pool acquisition.
3. Test the public health check:
   ```bash
   curl -i https://havenestate-backend.onrender.com/api/health
   ```
4. Remove frontend maintenance notice and resume traffic.

##### Step 8: Rollback Procedure (If Post-Cutover Issues Arise)
If application errors or incompatibilities are discovered immediately post-cutover:
1. Halt / suspend the backend service.
2. Terminate active sessions on `propertymanagement`:
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE datname = 'propertymanagement' AND pid <> pg_backend_pid();
   ```
3. Reverse the database rename to reinstate pre-recovery state:
   ```sql
   ALTER DATABASE propertymanagement RENAME TO propertymanagement_aborted_recovery;
   ALTER DATABASE propertymanagement_pre_recovery RENAME TO propertymanagement;
   GRANT CONNECT ON DATABASE propertymanagement TO havenestate_app;
   ```
4. Restart the backend service and investigate root causes.

---

### G. Known Limitations & Operational Notes

1. **Persistent Disk on Render**:
   - Render persistent disks are mounted to a single instance. Horizontal auto-scaling beyond 1 instance requires external cloud object storage (e.g. AWS S3, Cloudflare R2, or Google Cloud Storage).
   - If deploying on the Render Free Tier without persistent disks, uploaded images are stored on an ephemeral container layer and will be reset upon container restarts or deployments. The Starter Plan with persistent disk is required for production file persistence.
2. **Free-Tier Cold Starts**:
   - On Render free instances, the web service spins down after 15 minutes of inactivity. The initial incoming request may take 30–50 seconds to boot the JVM and establish connection pools.
3. **Reverse-Geocoding Rate Limits**:
   - OpenStreetMap Nominatim is used as the default client geocoding provider. To prevent IP rate limiting, client requests are cached for 5 minutes in browser storage. High-throughput commercial deployments should configure a Google Maps or Mapbox API key in `VITE_GEOCODING_API_KEY`.


