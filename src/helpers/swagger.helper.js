import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    openapi: '3.0.0',
    info: {
      title: 'Simple Book Lib',
      version: '1.0.0',
      description: 'A simple book library system',
    },
    responses: {
      '400': {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: {
              $ref: '#components/schemas/ErrorResponse'
            }
          }
        }
      },
      '404': {
        description: 'Not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#components/schemas/ErrorResponse'
            }
          }
        }
      },
      '422': {
        description: 'Unprocessable entity',
        content: {
          'application/json': {
            schema: {
              $ref: '#components/schemas/ErrorResponse'
            }
          }
        }
      },
      '500': {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#components/schemas/ErrorResponse'
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            code: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            author: {
              type: 'string'
            },
            stock_available: {
              type: 'integer'
            },
          }
        },
        Member: {
          type: 'object',
          properties: {
            code: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            active_borrowed_count: {
              type: 'integer'
            },
            penalized_end_date: {
              oneOf: [
                {
                  type: 'string',
                  format: 'date-time',
                  example: '1970-01-01T00:00:00.000Z'
                },
                {
                  type: 'null'
                }
              ]
            }
          }
        },
        BaseResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'boolean',
              default: 'false'
            },
            message: {
              type: 'string'
            },
            data: {
              type: null
            }
          },
        },
        BorrowTransactionResponse: {
          allOf: [
            {
              $ref: '#components/schemas/BaseResponse'
            },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  properties: {
                    borrow_code: {
                      type: 'string'
                    },
                    book: {
                      $ref: '#components/schemas/Book'
                    },
                    member: {
                      $ref: '#components/schemas/Member'
                    }
                  }
                }
              }
            }
          ]
        },
      }
    }
  },
  apis: ['./src/apidocs/*.js',],
};


const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};