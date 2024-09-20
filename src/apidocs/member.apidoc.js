/**
 * @swagger
 * /member:
 *   get:
 *     summary: Get list of members
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#components/schemas/BaseResponse'
 *                - type: object
 *                  properties:
 *                    data:
 *                      type: object
 *                      properties:
 *                        count:
 *                          type: integer
 *                          example: 10
 *                        rows:
 *                          type: array
 *                          items:
 *                            $ref: '#components/schemas/Member'
 *       500:
 *        $ref: '#/responses/500'
 *     parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            example: 1
 *        - in: query
 *          name: per_page
 *          schema:
 *            type: integer
 *            example: 10
 *     tags:
 *        - Member
 */