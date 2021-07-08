import { Router } from 'express';

import githubRoutes from './github.routes';

const routes = Router();

routes.use('/github', githubRoutes);

export default routes;
