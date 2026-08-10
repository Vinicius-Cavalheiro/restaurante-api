import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Raízes do Nordeste",
      version: "1.0.0",
      description:
        "API Back-end para gerenciamento de unidades, produtos, estoque, pedidos, pagamentos, fidelidade e auditoria.",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "ESTOQUE_INSUFICIENTE",
            },
            message: {
              type: "string",
              example:
                "Estoque insuficiente para realizar a operação.",
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/routes/*.ts",
  ],
};

export const swaggerSpec =
  swaggerJsdoc(options);