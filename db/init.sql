-- Crear tablas para ExportCoffee

CREATE TABLE IF NOT EXISTS caficultores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    finca VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lotes (
    id SERIAL PRIMARY KEY,
    caficultor_id INTEGER REFERENCES caficultores(id) ON DELETE CASCADE,
    variedad VARCHAR(50) NOT NULL,
    altura INTEGER, -- Metros sobre el nivel del mar
    peso_inicial DECIMAL(10,2), -- Kg
    fecha_cosecha DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS procesos (
    id SERIAL PRIMARY KEY,
    lote_id INTEGER REFERENCES lotes(id) ON DELETE CASCADE,
    tipo VARCHAR(20) CHECK (tipo IN ('fermentacion', 'secado')),
    sub_tipo VARCHAR(50), -- Ej: Lavado, Natural, Honey
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    temperatura_promedio DECIMAL(5,2),
    humedad_promedio DECIMAL(5,2),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba iniciales
INSERT INTO caficultores (nombre, finca, region) VALUES 
('Juan Pérez', 'Finca La Esperanza', 'Tarrazú'),
('María Rodríguez', 'Finca El Mirador', 'Chirripó');

INSERT INTO lotes (caficultor_id, variedad, altura, peso_inicial) VALUES 
(1, 'Caturra', 1850, 150.50),
(2, 'Geisha', 1950, 80.00);
