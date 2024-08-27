const fs = require('fs');
const { Client } = require('pg');
const tj = require('@tmcw/togeojson');
const { DOMParser } = require('xmldom');
const path = require('path');

// PostgreSQL connection details (user and password left empty)
const client = new Client({
  host: 'localhost',
  database: 'cycling_db',
  port: 5432,
});

client.connect();

// Define the correct path to your KML file
const kmlFilePath = path.join(__dirname, '../data/CYCTRACK.kml');

// Read and parse the KML file
fs.readFile(kmlFilePath, 'utf8', (err, data) => {
  if (err) throw err;

  // Parse the KML file into a DOM
  const kmlDom = new DOMParser().parseFromString(data, 'text/xml');

  // Convert the KML DOM into GeoJSON
  const geojson = tj.kml(kmlDom);

  // Log the GeoJSON output to understand its structure
  console.log(JSON.stringify(geojson, null, 2));

  // Filter out all the LineString features
  const lineStrings = geojson.features.filter(
    feature => feature.geometry.type === 'LineString'
  );

  if (lineStrings.length > 0) {
    lineStrings.forEach((lineString, index) => {
      // Convert the GeoJSON coordinates to WKT format for insertion into PostGIS
      const coordinates = lineString.geometry.coordinates
        .map(coord => `${coord[0]} ${coord[1]}`)
        .join(',');

      const wktLineString = `LINESTRING(${coordinates})`;

      // Insert into PostgreSQL
      const query = `
        INSERT INTO planned_routes (route_name, planned_path, total_distance)
        VALUES ($1, ST_GeogFromText($2), ST_Length(ST_GeogFromText($2)))
      `;
      const values = [`Imported Route ${index + 1}`, wktLineString];

      client.query(query, values, (err, res) => {
        if (err) {
          console.error('Error inserting data:', err.stack);
        } else {
          console.log(`Data inserted successfully for route ${index + 1}`);
        }
      });
    });

  } else {
    console.error('No LineString found in the KML file.');
    client.end();
  }
});
