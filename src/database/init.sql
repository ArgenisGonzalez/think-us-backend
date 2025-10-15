-- Script de inicialización de la base de datos
-- Sistema de Gestión de Empleados y Solicitudes
-- ============================================
-- Tabla: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    "isActive" BOOLEAN DEFAULT false,
    "isEmailConfirmed" BOOLEAN DEFAULT false,
    password VARCHAR(255) NOT NULL,
    "authType" VARCHAR(255) DEFAULT 'email' CHECK ("authType" IN ('email', 'microsoft', 'google')),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabla: roles
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(150)
);

-- ============================================
-- Tabla: user_roles (relación muchos a muchos)
-- ============================================
CREATE TABLE IF NOT EXISTS user_roles (
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "roleId" INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY ("userId", "roleId")
);

-- ============================================
-- Tabla: employees
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    position VARCHAR(100),
    salary DECIMAL(10, 2),
    email VARCHAR(100) UNIQUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabla: solicitudes
-- ============================================
CREATE TABLE IF NOT EXISTS solicitudes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(255) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'cancelada', 'completada')),
    "employeeId" INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================
-- Datos iniciales: Roles
-- ============================================
INSERT INTO roles (name, description) 
VALUES 
    ('empleado', 'Rol de empleado'),
    ('administrador', 'Rol de administrador')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Datos iniciales: Usuarios de ejemplo
-- Password hasheado de "Passw0rd123" con bcrypt
-- ============================================
INSERT INTO users ("firstName", "lastName", email, password, "isActive", "isEmailConfirmed", "authType", "createdAt", "updatedAt")
VALUES 
    ('Empleado', 'Demo', 'empleado@example.com', '$2b$10$8ZqP5Y.rJ9FEKkVXw5NZNOxGJxvZ5h5V9YQm0JKxWxWZQXXqKQm0m', true, true, 'email', NOW(), NOW()),
    ('Administrador', 'Demo', 'administrador@example.com', '$2b$10$8ZqP5Y.rJ9FEKkVXw5NZNOxGJxvZ5h5V9YQm0JKxWxWZQXXqKQm0m', true, true, 'email', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;


INSERT INTO user_roles ("userId", "roleId")
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'empleado@example.com' AND r.name = 'empleado'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles ("userId", "roleId")
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'administrador@example.com' AND r.name = 'administrador'
ON CONFLICT DO NOTHING;
