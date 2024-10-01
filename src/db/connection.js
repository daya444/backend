

import {connect,disconnect} from "mongoose"

  
export const ConnectToDatabase = async () => {
    try {
       
        await connect(process.env.MONGODB_URL);
        
    } catch (e) {
        console.log(e);
        throw new Error("Could not connect to MongoDB");
    }
};


export const DisconnectToDatabase = async ()=> {

    try{
        await  disconnect();

    }catch (e){
        console.log(e)
        throw new Error("could not disconnect to mongodb")
    }

}