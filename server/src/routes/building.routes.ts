import { Router } from 'express';
import { buildingController } from '../controllers/building.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { buildingSchema, updateBuildingSchema } from '../validators/building.schema.js';

const router = Router();

router.use(authenticateUser);

router.get('/', buildingController.getBuildings);
router.get('/:id', buildingController.getBuildingById);
router.post('/', validateBody(buildingSchema), buildingController.createBuilding);
router.patch('/:id', validateBody(updateBuildingSchema), buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

export default router;
