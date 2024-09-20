import { Router } from 'express';
import { borrowBook, list, returnBorrowedBook } from '../controllers/book.controller';

const routes = Router();

routes.get('/book', list);
routes.post('/book/borrow', borrowBook);
routes.post('/book/return', returnBorrowedBook);

module.exports = routes;