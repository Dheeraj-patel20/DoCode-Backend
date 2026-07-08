import dotenv from "dotenv";
const res=dotenv.config({
  path: "./.env",
});
import app from "./app.js";
import connectDb from "./db/dbConnection.js";
const port = process.env.PORT || 3000;


connectDb()
  .then(
    app.listen(port, () => {
      console.log(`Server is running at the port http://localhost:${port}`);
      
    }),
  )
  .catch((err) => {
    console.error("MongoDb Connection Error", err);
    process.exit(1);
  });

