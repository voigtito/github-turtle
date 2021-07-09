import { Router } from 'express';

import githubRoutes from '../modules/github/routes/github.routes';

const routes = Router();

routes.use('/github', githubRoutes);

export default routes;
