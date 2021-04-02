import { Router } from 'express';

const routes = Router();

// Middlewares Authenticated
import { authenticated, authorization } from '../auth/auth.js';

// Controllers
import { sendMailsUsers,
        getAllMailsSends,
        getAllMailsReceived,
        getSingleMail,
        deleteMail
} from '../controllers/usersMailsController.js';

// Routes
routes.post('/send/mail/user', authenticated, authorization, sendMailsUsers);
routes.get('/user/mails/all/sends', authenticated, authorization, getAllMailsSends);
routes.get('/user/mails/all/received', authenticated, authorization, getAllMailsReceived);
routes.get('/user/mail/:id', authenticated, authorization, getSingleMail);
routes.post('/user/mail/deleted/:id', authenticated, authorization, deleteMail);

export default routes;