const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi=require('swagger-ui-express')

const swaggerOptions={
    swaggerDefinition:{
        info:{
            title:'Customer API',
            description:"Customer API Information",
            contact:{
                name:'Amazing Developer'
            },
            // servers:["http://localhost:3000"]
            servers:["https://quanlynhatro01.herokuapp.com"]
        }
    },
    apis:["routes.js"]
}

const swaggerDocs=swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocs))
}
  
  