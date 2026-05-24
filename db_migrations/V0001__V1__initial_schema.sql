
CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(200),
  account_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(5) NOT NULL,
  instructor_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".users(id),
  start_date VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".group_students (
  group_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".groups(id),
  student_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".users(id),
  PRIMARY KEY (group_id, student_id)
);

CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(200),
  category VARCHAR(10) NOT NULL,
  comment TEXT,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".student_documents (
  student_id INTEGER PRIMARY KEY REFERENCES "t_p4445296_start_drivingschool_".users(id),
  passport BOOLEAN DEFAULT FALSE,
  photo BOOLEAN DEFAULT FALSE,
  medical BOOLEAN DEFAULT FALSE,
  contract BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".slots (
  id SERIAL PRIMARY KEY,
  instructor_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".users(id),
  slot_date DATE NOT NULL,
  slot_time VARCHAR(10) NOT NULL,
  student_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".users(id),
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".journal (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".users(id),
  instructor_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".users(id),
  lesson_date VARCHAR(20) NOT NULL,
  hours INTEGER NOT NULL DEFAULT 2,
  grade INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "t_p4445296_start_drivingschool_".reviews (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES "t_p4445296_start_drivingschool_".users(id),
  rating INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
