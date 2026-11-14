import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { projectSchema, updateProjectSchema } from '../validators/project.schema.js';

const router = Router();

router.use(authenticateUser);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', validateBody(projectSchema), projectController.createProject);
router.patch('/:id', validateBody(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
