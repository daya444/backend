import app from "./app.js";
import { ConnectToDatabase } from "./src/db/connection.js";

const PORT = process.env.PORT || 5000

ConnectToDatabase().then(()=>{

  app.listen(PORT, ()=> console.log("server open and connected to db"))

}).catch((e)=>console.log(e))



