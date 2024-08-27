DROP DATABASE cycling_db IF EXISTS;
CREATE DATABASE cycling_db;

\c cycling_db

CREATE EXTENSION postgis;

CREATE TABLE planned_routes (
    id SERIAL PRIMARY KEY,
    route_name VARCHAR(255),               -- Optional: Name of the route
    planned_path GEOGRAPHY(LineString, 4326), -- Stores the entire planned route as a LineString
    total_distance DOUBLE PRECISION,       -- Optional: Total distance of the route in meters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Automatically store the record creation time
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- Automatically store the record update time
);
