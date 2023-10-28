import Config from 'config';
import Routes from './routes';
import Server from './common/sever';
import Express from "express";
const app=Express();

app.use(Express.json());
const {databaseHost,databasePort,databaseName,port}=Config;
const dbUrl=`mongodb://${databaseHost}:${databasePort}/${databaseName}`
const server = new Server()
  .configureSwagger(Config.get("swaggerDefinition"))
  // .handleError()
  .router(Routes)
  .configureDb(dbUrl)
  .then((_server) => _server.listen(port));

  
export default server;