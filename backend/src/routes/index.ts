import { Router } from 'express';
import { healthRoutes } from './health.routes';

const apiRouter = Router();

// Mount feature routers
apiRouter.use('/health', healthRoutes);

export { apiRouter };

