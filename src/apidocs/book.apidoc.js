/**
 * @swagger
 * /book:
 *   get:
 *     summary: Get list of books
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
 *                            $ref: '#components/schemas/Book'
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
 *        - Book
 * /book/borrow:
 *   post:
 *     summary: Borrow a book for a member
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/BorrowTransactionResponse'
 *
 *       400:
 *        $ref: '#/responses/400'
 *       404:
 *        $ref: '#/responses/404'
 *       422:
 *        $ref: '#/responses/422'
 *       500:
 *        $ref: '#/responses/500'
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                required:
 *                  - member_code
 *                  - book_code
 *                properties:
 *                  member_code:
 *                    type: string
 *                  book_code:
 *                    type: string
 *     tags:
 *        - Book
 * /book/return:
 *   post:
 *     summary: Return borrowed book
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#components/schemas/BorrowTransactionResponse'
 *
 *       400:
 *        $ref: '#/responses/400'
 *       404:
 *        $ref: '#/responses/404'
 *       422:
 *        $ref: '#/responses/422'
 *       500:
 *        $ref: '#/responses/500'
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                required:
 *                  - borrow_code
 *                properties:
 *                  borrow_code:
 *                    type: string
 *     tags:
 *        - Book
 */