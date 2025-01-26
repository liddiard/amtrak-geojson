// Replace amtrak-geojson station names with the more accurate names from the Amtraker API
// Run with: `deno run --allow-read --allow-write mapStationNames.ts`

import { stationNames } from "./amtraker-v3/data/stations.ts";

const readGeoJson = async (path: string) => {
  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile(path);
  return JSON.parse(decoder.decode(data));
};

const amtrakStations = await readGeoJson(
  "../public/amtrak-geojson/amtrak-stations.geojson"
);

for (const station of amtrakStations.features) {
  let newName = stationNames[station.properties.STNCODE];
  if (!newName) {
    newName = station.properties.STNNAME.split(",")[0];
    console.warn(
      `No mapped name for ${station.properties.STNCODE}; using unmapped name ${newName}`
    );
  }
  station.properties.STNNAME = newName;
}

await Deno.writeFile(
  "../public/amtrak-geojson/amtrak-stations.geojson",
  new TextEncoder().encode(JSON.stringify(amtrakStations))
);
