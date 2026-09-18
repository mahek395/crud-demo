CREATE DATABASE IF NOT EXISTS memighty_crud;
USE memighty_crud;

CREATE TABLE IF NOT EXISTS course_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  profile_photo VARCHAR(255),
  course_category VARCHAR(50) NOT NULL,
  preferred_batch ENUM('Morning','Evening','Weekend') NOT NULL,
  start_date DATE NOT NULL,
  prior_experience TEXT,
  placement_assistance BOOLEAN DEFAULT FALSE,
  agree_terms BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
