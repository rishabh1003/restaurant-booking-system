import express from "express";
import Mongoose from 'mongoose';
import morgan from 'morgan';
import * as path from "path";
const root = path.normalize(`${__dirname}/../..`);
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

// const app =  express();
class ExpressServer {

  constructor(){
    this.app=express();

    this.app.use(express.json({limit:'1000mb'}));
    this.app.use(express.urlencoded({extended:true,limit:'100mb'}));
    this.app.use(morgan('dev'));

    this.app.use(
      cors({
        allowedHeaders:["content-Type","token","authorization"],
        exposedHeaders:["token","authorization"],
        origin:"*",
        methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
        prefLightContinue: false
      })
    )
  }

  

  router(routes){
    this.app.use(routes);
    return this
  }

  configureSwagger(swaggerDefinition) {
    const options = {
      // swaggerOptions : { authAction :{JWT :{name:"JWT", schema :{ type:"apiKey", in:"header", name:"Authorization", description:""}, value:"Bearer <JWT>"}}},
      swaggerDefinition,
      apis: [
        path.resolve(`${root}/server/api/v1/controllers/**/*.js`),
        path.resolve(`${root}/api.yaml`),
      ],
    };

   this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(options))
    );
    return this;
  }
  async configureDb(dbUrl) {

    try {
      Mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      console.log("mongodb connection done")
      return this;
    } catch (error) {
       console.log(`error in mongodb connections ${error.message}`)
       throw error;
    }
  }


  listen(port) {
    this.app.listen(port, () => {
      console.log(`secure app is listening @port ${port}`);
    });
    // return app;
  }
}

export default ExpressServer;
