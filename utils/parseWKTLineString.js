const data = `
"LINESTRING (114.132421 22.259624 0.0, 114.132418 22.259646 0.0, 114.132413 22.259667 0.0, 114.132406 22.259687 0.0, 114.132397 22.259707 0.0, 114.132386 22.259726 0.0, 114.132373 22.259744 0.0, 114.132358 22.259761 0.0, 114.132343 22.259777 0.0, 114.132326 22.259792 0.0, 114.132309 22.259818 0.0, 114.132294 22.259845 0.0, 114.132281 22.259873 0.0, 114.13227 22.259903 0.0, 114.132262 22.259933 0.0, 114.132247 22.259964 0.0, 114.132229 22.259993 0.0, 114.132209 22.260021 0.0, 114.132185 22.260047 0.0, 114.13216 22.260071 0.0, 114.132125 22.260103 0.0, 114.132089 22.260133 0.0, 114.132049 22.260159 0.0, 114.132021 22.260185 0.0, 114.131994 22.260212 0.0, 114.13197 22.260241 0.0, 114.131949 22.260272 0.0, 114.131937 22.260288 0.0, 114.131923 22.260304 0.0, 114.131908 22.260318 0.0, 114.131891 22.260331 0.0, 114.131874 22.260343 0.0, 114.131855 22.260353 0.0, 114.131835 22.260362 0.0, 114.131815 22.260369 0.0, 114.131794 22.260374 0.0, 114.131773 22.260378 0.0, 114.131743 22.26039 0.0, 114.131713 22.260403 0.0, 114.131684 22.260417 0.0)",kml_1,Attributes
 OBJECTID 1 
 OWNER TD 
 SHAPE_Length 121.074566580866 ,1,TD,121.074566580866
"LINESTRING (114.132808 22.258675 0.0, 114.132826 22.258592 0.0, 114.132845 22.25851 0.0, 114.132865 22.258429 0.0, 114.132871 22.258369 0.0, 114.132874 22.258309 0.0, 114.132872 22.258249 0.0, 114.132874 22.258197 0.0, 114.132878 22.258144 0.0, 114.132885 22.258092 0.0, 114.132882 22.258061 0.0, 114.132882 22.258031 0.0, 114.132885 22.258 0.0, 114.13289 22.25797 0.0, 114.132895 22.257938 0.0, 114.132898 22.257906 0.0, 114.132901 22.257874 0.0, 114.1329 22.257827 0.0, 114.132898 22.25778 0.0, 114.132896 22.257733 0.0, 114.132882 22.257646 0.0, 114.132866 22.257559 0.0, 114.132847 22.257473 0.0, 114.132816 22.257361 0.0, 114.132784 22.257249 0.0, 114.13275 22.257137 0.0, 114.132649 22.256827 0.0, 114.132548 22.256516 0.0, 114.132447 22.256205 0.0, 114.132409 22.256086 0.0, 114.13237 22.255968 0.0, 114.132332 22.255849 0.0)",kml_2,Attributes
 OBJECTID 2 
 OWNER TD 
 SHAPE_Length 321.906905762732 ,2,TD,321.906905762732
"LINESTRING (114.131562 22.260501 0.0, 114.13155 22.260511 0.0, 114.131538 22.260522 0.0, 114.131527 22.260533 0.0, 114.131488 22.260583 0.0, 114.131449 22.260631 0.0, 114.131408 22.260679 0.0, 114.13139 22.260692 0.0, 114.131371 22.260704 0.0, 114.131351 22.260714 0.0, 114.131329 22.260723 0.0, 114.131307 22.26073 0.0, 114.131285 22.260735 0.0, 114.131262 22.260739 0.0, 114.131231 22.260753 0.0, 114.131202 22.260769 0.0, 114.131174 22.260788 0.0, 114.131148 22.260809 0.0)",kml_3,Attributes
 OBJECTID 3 
 OWNER TD 
 SHAPE_Length 56.2459485942789 ,3,TD,56.2459485942789
`;

function parseWKTLineString(wktString) {
    // Remove the "LINESTRING" part and the parentheses
    const coordinateString = wktString.replace("LINESTRING (", "").replace(")", "").trim();

    // Split the coordinates by commas, then map them to objects with lat and lng
    const coordinates = coordinateString.split(",").map(coord => {
        // Trim any extra whitespace and split by space
        const [lng, lat] = coord.trim().split(/\s+/).map(Number); // Split by one or more spaces
        return { lat, lng }; // Return an object with lat and lng
    });

    return coordinates;
}

// Function to extract all LINESTRINGs from the data
function extractLineStrings(data) {
    const lineStrings = [];
    const lines = data.split("\n").filter(line => line.includes("LINESTRING"));

    lines.forEach(line => {
        // Extract the full WKT part using regex
        const match = line.match(/LINESTRING\s*\(.*?\)/);
        if (match) {
            const wktPart = match[0];
            const parsedCoordinates = parseWKTLineString(wktPart);
            lineStrings.push(parsedCoordinates);
        }
    });

    return lineStrings;
}

// Process the data to get the desired format
const parsedLineStrings = extractLineStrings(data);

console.log("Parsed LineStrings:", JSON.stringify(parsedLineStrings, null, 2)); // Final output in desired format
