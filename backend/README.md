# MEMIGHTY CRUD Rehearsal — Backend

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in your MySQL credentials
3. Run `sql/schema.sql` in MySQL Workbench (or `mysql -u root -p < sql/schema.sql`) to create the database and table
4. `npm run dev` (starts on http://localhost:5000)

## API Endpoints
| Method | Route | Description |
|---|---|---|
| POST | /api/registrations | Create a registration (multipart/form-data, field name `profile_photo` for the image) |
| GET | /api/registrations | List all registrations |
| GET | /api/registrations/:id | Get one registration |
| PUT | /api/registrations/:id | Update a registration (multipart/form-data) |
| DELETE | /api/registrations/:id | Delete a registration |

Uploaded images are served statically from `/uploads/<filename>`.
