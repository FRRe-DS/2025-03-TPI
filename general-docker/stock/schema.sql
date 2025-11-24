-- PostgreSQL Database Schema for Stock Management System

-- Create database (run this manually first)
-- CREATE DATABASE stock_management;

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS reserva_productos;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS producto_categorias;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock_disponible INTEGER NOT NULL DEFAULT 0 CHECK (stock_disponible >= 0),
    peso_kg DECIMAL(8,3) CHECK (peso_kg >= 0),
    dimensiones JSONB, -- {largoCm, anchoCm, altoCm}
    ubicacion JSONB,   -- {street, city, state, postal_code, country}
    imagenes JSONB,    -- array of {url, esPrincipal}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product-Category junction table (many-to-many relationship)
CREATE TABLE producto_categorias (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    UNIQUE(producto_id, categoria_id)
);

-- Reservations table
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    id_compra VARCHAR(255) NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'confirmado', 'cancelado')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    motivo_cancelacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reservation products table (items in a reservation)
CREATE TABLE reserva_productos (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE(reserva_id, producto_id)
);

-- Indexes for better performance
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_productos_stock ON productos(stock_disponible);
CREATE INDEX idx_producto_categorias_producto ON producto_categorias(producto_id);
CREATE INDEX idx_producto_categorias_categoria ON producto_categorias(categoria_id);
CREATE INDEX idx_reservas_usuario ON reservas(usuario_id);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_expires ON reservas(expires_at);
CREATE INDEX idx_reserva_productos_reserva ON reserva_productos(reserva_id);
CREATE INDEX idx_reserva_productos_producto ON reserva_productos(producto_id);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON reservas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Electrónicos', 'Productos electrónicos y tecnológicos'),
    ('Ropa', 'Vestimenta y accesorios'),
    ('Hogar', 'Artículos para el hogar y decoración'),
    ('Deportes', 'Equipamiento deportivo y fitness'),
    ('Libros', 'Libros físicos y digitales'),
    ('Juguetes', 'Juguetes para niños y coleccionables'),
    ('Alimentos', 'Productos alimenticios y bebidas'),
    ('Belleza', 'Productos de cuidado personal y cosmética'),
    ('Automotriz', 'Accesorios y repuestos para vehículos'),
    ('Mascotas', 'Productos para el cuidado de mascotas'),
    ('Música', 'Instrumentos musicales y accesorios'),
    ('Jardín', 'Herramientas y decoración para jardín'),
    ('Oficina', 'Artículos de papelería y oficina'),
    ('Salud', 'Productos para el cuidado de la salud'),
    ('Bebés', 'Productos para bebés y maternidad');

INSERT INTO productos (nombre, descripcion, precio, stock_disponible, peso_kg, dimensiones, ubicacion, imagenes) VALUES
    (
        'Laptop Gaming RGB',
        'Laptop para gaming con iluminación RGB y procesador de alta gama',
        1299.99,
        15,
        2.5,
        '{"largoCm": 35, "anchoCm": 25, "altoCm": 3}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/laptop1.jpg", "esPrincipal": true}, {"url": "https://example.com/laptop2.jpg", "esPrincipal": false}]'
    ),
    (
        'Camiseta Deportiva',
        'Camiseta transpirable para actividades deportivas',
        29.99,
        100,
        0.2,
        '{"largoCm": 70, "anchoCm": 50, "altoCm": 1}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/shirt1.jpg", "esPrincipal": true}]'
    ),
    (
        'Mesa de Comedor',
        'Mesa de madera maciza para 6 personas',
        599.00,
        8,
        25.0,
        '{"largoCm": 180, "anchoCm": 90, "altoCm": 75}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/table1.jpg", "esPrincipal": true}]'
    ),
    (
        'Smartphone X Pro',
        'Teléfono inteligente con cámara de 108MP y pantalla AMOLED',
        899.99,
        50,
        0.19,
        '{"largoCm": 16, "anchoCm": 7.5, "altoCm": 0.8}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/phone1.jpg", "esPrincipal": true}]'
    ),
    (
        'Auriculares Bluetooth',
        'Auriculares inalámbricos con cancelación de ruido activa',
        199.99,
        75,
        0.25,
        '{"largoCm": 20, "anchoCm": 18, "altoCm": 8}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/headphones1.jpg", "esPrincipal": true}]'
    ),
    (
        'Jean Classic Fit',
        'Pantalón jean clásico de algodón premium',
        59.99,
        120,
        0.5,
        '{"largoCm": 100, "anchoCm": 40, "altoCm": 2}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/jeans1.jpg", "esPrincipal": true}]'
    ),
    (
        'Zapatillas Running',
        'Zapatillas deportivas con tecnología de amortiguación',
        89.99,
        60,
        0.4,
        '{"largoCm": 30, "anchoCm": 20, "altoCm": 12}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/shoes1.jpg", "esPrincipal": true}]'
    ),
    (
        'Silla Ergonómica',
        'Silla de oficina con soporte lumbar ajustable',
        249.99,
        30,
        15.0,
        '{"largoCm": 65, "anchoCm": 65, "altoCm": 120}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/chair1.jpg", "esPrincipal": true}]'
    ),
    (
        'Lámpara LED Moderna',
        'Lámpara de pie con control de intensidad y temperatura de color',
        79.99,
        45,
        2.5,
        '{"largoCm": 30, "anchoCm": 30, "altoCm": 150}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/lamp1.jpg", "esPrincipal": true}]'
    ),
    (
        'Pelota de Fútbol',
        'Pelota oficial de fútbol tamaño 5',
        34.99,
        150,
        0.43,
        '{"largoCm": 22, "anchoCm": 22, "altoCm": 22}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/ball1.jpg", "esPrincipal": true}]'
    ),
    (
        'Bicicleta Mountain Bike',
        'Bicicleta de montaña con 21 velocidades y suspensión',
        449.99,
        12,
        14.0,
        '{"largoCm": 180, "anchoCm": 65, "altoCm": 110}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/bike1.jpg", "esPrincipal": true}]'
    ),
    (
        'El Principito',
        'Clásico de la literatura universal',
        15.99,
        200,
        0.15,
        '{"largoCm": 20, "anchoCm": 13, "altoCm": 1}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/book1.jpg", "esPrincipal": true}]'
    ),
    (
        'Cien Años de Soledad',
        'Obra maestra de Gabriel García Márquez',
        18.99,
        180,
        0.35,
        '{"largoCm": 23, "anchoCm": 15, "altoCm": 3}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/book2.jpg", "esPrincipal": true}]'
    ),
    (
        'Lego Star Wars Set',
        'Set de construcción Lego de 500 piezas',
        79.99,
        40,
        0.8,
        '{"largoCm": 35, "anchoCm": 25, "altoCm": 10}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/lego1.jpg", "esPrincipal": true}]'
    ),
    (
        'Muñeca Barbie',
        'Muñeca Barbie edición especial con accesorios',
        29.99,
        90,
        0.3,
        '{"largoCm": 30, "anchoCm": 15, "altoCm": 8}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/barbie1.jpg", "esPrincipal": true}]'
    ),
    (
        'Café Colombiano Premium',
        'Café en grano 100% arábica de origen colombiano - 500g',
        24.99,
        250,
        0.5,
        '{"largoCm": 20, "anchoCm": 10, "altoCm": 8}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/coffee1.jpg", "esPrincipal": true}]'
    ),
    (
        'Aceite de Oliva Extra Virgen',
        'Aceite de oliva premium - 1 litro',
        19.99,
        100,
        1.0,
        '{"largoCm": 25, "anchoCm": 8, "altoCm": 8}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/oil1.jpg", "esPrincipal": true}]'
    ),
    (
        'Crema Facial Antiarrugas',
        'Crema facial con ácido hialurónico y colágeno - 50ml',
        39.99,
        80,
        0.1,
        '{"largoCm": 8, "anchoCm": 8, "altoCm": 6}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/cream1.jpg", "esPrincipal": true}]'
    ),
    (
        'Shampoo Reparador',
        'Shampoo para cabello dañado con keratina - 400ml',
        14.99,
        150,
        0.45,
        '{"largoCm": 20, "anchoCm": 8, "altoCm": 8}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/shampoo1.jpg", "esPrincipal": true}]'
    ),
    (
        'Filtro de Aire Automotriz',
        'Filtro de aire universal para vehículos',
        24.99,
        70,
        0.3,
        '{"largoCm": 25, "anchoCm": 20, "altoCm": 8}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/filter1.jpg", "esPrincipal": true}]'
    ),
    (
        'Aceite de Motor 10W40',
        'Aceite sintético para motor - 4 litros',
        49.99,
        55,
        3.5,
        '{"largoCm": 25, "anchoCm": 15, "altoCm": 20}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/oil-motor1.jpg", "esPrincipal": true}]'
    ),
    (
        'Alimento Balanceado para Perros',
        'Alimento premium para perros adultos - 15kg',
        64.99,
        45,
        15.0,
        '{"largoCm": 60, "anchoCm": 40, "altoCm": 15}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/dogfood1.jpg", "esPrincipal": true}]'
    ),
    (
        'Arena para Gatos',
        'Arena sanitaria aglutinante sin olor - 10kg',
        19.99,
        85,
        10.0,
        '{"largoCm": 45, "anchoCm": 30, "altoCm": 12}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/catlitter1.jpg", "esPrincipal": true}]'
    ),
    (
        'Guitarra Acústica',
        'Guitarra acústica de cuerdas de acero con funda',
        199.99,
        20,
        2.0,
        '{"largoCm": 100, "anchoCm": 38, "altoCm": 12}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/guitar1.jpg", "esPrincipal": true}]'
    ),
    (
        'Teclado Musical 61 Teclas',
        'Teclado electrónico con múltiples sonidos y ritmos',
        149.99,
        25,
        4.5,
        '{"largoCm": 95, "anchoCm": 35, "altoCm": 12}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/keyboard1.jpg", "esPrincipal": true}]'
    ),
    (
        'Set de Herramientas de Jardín',
        'Kit completo con pala, rastrillo y tijeras de podar',
        59.99,
        35,
        3.0,
        '{"largoCm": 90, "anchoCm": 30, "altoCm": 10}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/gardentools1.jpg", "esPrincipal": true}]'
    ),
    (
        'Maceta Decorativa Grande',
        'Maceta de cerámica con plato - 40cm diámetro',
        34.99,
        50,
        5.0,
        '{"largoCm": 40, "anchoCm": 40, "altoCm": 35}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/pot1.jpg", "esPrincipal": true}]'
    ),
    (
        'Cuaderno Universitario A4',
        'Cuaderno espiral de 200 hojas rayadas',
        8.99,
        300,
        0.5,
        '{"largoCm": 30, "anchoCm": 21, "altoCm": 2}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/notebook1.jpg", "esPrincipal": true}]'
    ),
    (
        'Set de Bolígrafos',
        'Pack de 12 bolígrafos de colores variados',
        12.99,
        200,
        0.15,
        '{"largoCm": 20, "anchoCm": 10, "altoCm": 2}',
        '{"street": "Av. Corrientes 1234", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1043AAZ", "country": "AR"}',
        '[{"url": "https://example.com/pens1.jpg", "esPrincipal": true}]'
    ),
    (
        'Termómetro Digital',
        'Termómetro infrarrojo sin contacto',
        29.99,
        100,
        0.2,
        '{"largoCm": 15, "anchoCm": 10, "altoCm": 5}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/thermometer1.jpg", "esPrincipal": true}]'
    ),
    (
        'Vitaminas Multivitamínico',
        'Suplemento vitamínico completo - 60 comprimidos',
        19.99,
        120,
        0.1,
        '{"largoCm": 12, "anchoCm": 6, "altoCm": 6}',
        '{"street": "Av. Santa Fe 5678", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1425BGH", "country": "AR"}',
        '[{"url": "https://example.com/vitamins1.jpg", "esPrincipal": true}]'
    ),
    (
        'Pañales Recién Nacido',
        'Paquete de pañales talla RN - 40 unidades',
        24.99,
        150,
        1.5,
        '{"largoCm": 35, "anchoCm": 25, "altoCm": 15}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/diapers1.jpg", "esPrincipal": true}]'
    ),
    (
        'Biberón Anticólico',
        'Biberón de 250ml con sistema anticólico',
        14.99,
        95,
        0.15,
        '{"largoCm": 20, "anchoCm": 8, "altoCm": 8}',
        '{"street": "Av. Cabildo 9876", "city": "Buenos Aires", "state": "CABA", "postal_code": "C1426AAA", "country": "AR"}',
        '[{"url": "https://example.com/bottle1.jpg", "esPrincipal": true}]'
    );

-- Assign categories to products
INSERT INTO producto_categorias (producto_id, categoria_id) VALUES
    (1, 1),   -- Laptop -> Electrónicos
    (2, 2),   -- Camiseta -> Ropa
    (2, 4),   -- Camiseta -> Deportes
    (3, 3),   -- Mesa -> Hogar
    (4, 1),   -- Smartphone -> Electrónicos
    (5, 1),   -- Auriculares -> Electrónicos
    (6, 2),   -- Jean -> Ropa
    (7, 2),   -- Zapatillas -> Ropa
    (7, 4),   -- Zapatillas -> Deportes
    (8, 3),   -- Silla -> Hogar
    (8, 13),  -- Silla -> Oficina
    (9, 3),   -- Lámpara -> Hogar
    (10, 4),  -- Pelota -> Deportes
    (11, 4),  -- Bicicleta -> Deportes
    (12, 5),  -- El Principito -> Libros
    (13, 5),  -- Cien Años de Soledad -> Libros
    (14, 6),  -- Lego -> Juguetes
    (15, 6),  -- Barbie -> Juguetes
    (16, 7),  -- Café -> Alimentos
    (17, 7),  -- Aceite -> Alimentos
    (18, 8),  -- Crema Facial -> Belleza
    (19, 8),  -- Shampoo -> Belleza
    (20, 9),  -- Filtro de Aire -> Automotriz
    (21, 9),  -- Aceite de Motor -> Automotriz
    (22, 10), -- Alimento para Perros -> Mascotas
    (23, 10), -- Arena para Gatos -> Mascotas
    (24, 11), -- Guitarra -> Música
    (25, 11), -- Teclado Musical -> Música
    (26, 12), -- Set de Herramientas -> Jardín
    (27, 12), -- Maceta -> Jardín
    (28, 13), -- Cuaderno -> Oficina
    (29, 13), -- Bolígrafos -> Oficina
    (30, 14), -- Termómetro -> Salud
    (31, 14), -- Vitaminas -> Salud
    (32, 15), -- Pañales -> Bebés
    (33, 15); -- Biberón -> Bebés

-- Create a view for easier product querying with categories
CREATE OR REPLACE VIEW productos_con_categorias AS
SELECT 
    p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.stock_disponible,
    p.peso_kg,
    p.dimensiones,
    p.ubicacion,
    p.imagenes,
    p.created_at,
    p.updated_at,
    COALESCE(
        json_agg(
            CASE WHEN c.id IS NOT NULL 
            THEN json_build_object('id', c.id, 'nombre', c.nombre, 'descripcion', c.descripcion)
            ELSE NULL END
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'::json
    ) as categorias
FROM productos p
LEFT JOIN producto_categorias pc ON p.id = pc.producto_id
LEFT JOIN categorias c ON pc.categoria_id = c.id
GROUP BY p.id, p.nombre, p.descripcion, p.precio, p.stock_disponible, p.peso_kg, p.dimensiones, p.ubicacion, p.imagenes, p.created_at, p.updated_at;
