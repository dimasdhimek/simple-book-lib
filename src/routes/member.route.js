import { Router } from 'express';
import { list } from '../controllers/member.controller';

const routes = Router();

routes.get('/member', list);

module.exports = routes;