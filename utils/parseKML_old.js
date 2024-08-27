const fs = require('fs');
const { Client } = require('pg');
const xml2js = require('xml2js');
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

  xml2js.parseString(data, (err, result) => {
    if (err) throw err;

    // Navigate the KML structure to find the Placemark elements
    const placemarks = result['kml']['Document'][0]['Folder'][0]['Placemark'];

    if (!placemarks) {
      console.error("No Placemark found in the KML file.");
      return;
    }

    // Check if placemarks is an array or an object
    if (Array.isArray(placemarks)) {
      // If it's an array, iterate over it
      placemarks.forEach(placemark => processPlacemark(placemark));
    } else {
      // If it's a single object, process it directly
      processPlacemark(placemarks);
    }
  });
});

// Function to process each Placemark and insert it into the database
function processPlacemark(placemark) {
  if (placemark.LineString) {
    const lineString = placemark.LineString[0];
    if (!lineString || !lineString.coordinates) {
      console.error("No coordinates found in the LineString.");
      return;
    }

    const coordinates = lineString.coordinates[0].trim().split(/\s+/).map(coord => {
      const [lon, lat] = coord.split(',').map(parseFloat);
      return `${lon} ${lat}`;
    }).join(',');

    const wktLineString = `LINESTRING(${coordinates})`;

    // Insert into PostgreSQL
    const query = `
      INSERT INTO planned_routes (route_name, planned_path, total_distance)
      VALUES ($1, ST_GeogFromText($2), ST_Length(ST_GeogFromText($2)))
    `;
    const values = ['Imported Route', wktLineString];

    client.query(query, values, (err, res) => {
      if (err) {
        console.error('Error inserting data:', err.stack);
      } else {
        console.log('Data inserted successfully');
      }
    });
  } else {
    console.error("No LineString found in the Placemark.");
  }
}

// Close the PostgreSQL connection after all queries are done
client.on('end', () => {
  console.log('PostgreSQL connection closed');
});
