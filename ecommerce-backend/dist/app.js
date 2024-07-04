//WHY WE NEED TSC ITS ANS ************
// TypeScript files (.ts or .tsx) are not directly executable in a typical JavaScript runtime environment (like Node.js or web browsers). They need to be transpiled into plain JavaScript (.js), which is what the TypeScript compiler (tsc) does.
// The dist folder is the designated location for these compiled JavaScript files.
import express from "express";
const port = 4000;
const app = express();
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
