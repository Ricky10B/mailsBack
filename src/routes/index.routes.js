import { Router } from 'express';

import usersRoutes from './users.routes.js';
import mailsroutes from './mails.routes.js';

const routes = Router();

routes.use(usersRoutes);
routes.use(mailsroutes);

export default routes;