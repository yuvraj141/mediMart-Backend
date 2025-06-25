import {Server} from 'http'
import mongoose from 'mongoose'
import config from './app/config'
import app from './app'

let server:Server |null=null;

async function main() {
    try{
        await mongoose.connect(config.database_url as string)

        server=app.listen(config.port,()=>{
            console.log(`app is running on port ${config.port}`);
        })
    }catch(err){
        console.error('Failed to connect database ',err);
    
    }
}

main()

process.on('unhandledRejection', (err) => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
