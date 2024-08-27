import express from "express";
import pg from "pg";

const client = new pg.Client({ database: "cycling_db" });
client.connect();

const app = express();
const PORT = 8080;

app.get("/planned_route", async (req, res) => {
  let queryResult = await client.query(
    "SELECT id,route_name,total_distance,created_at,updated_at,ST_AsText(planned_path) AS path FROM planned_routes ORDER BY id ASC"
  );

  res.json({ data: queryResult.rows });
});

app.use(express.static("public"));
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
