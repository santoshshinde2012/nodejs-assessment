import { Router } from 'express';
import OrganizationController from './components/organization/OrganizationController';
import PropertyController from './components/property/PropertyController';
import RegionController from './components/region/RegionController';
import FieldController from './components/field/FieldController';

import CropController from './components/crop/CropController';
import CropCycleController from './components/crop_cycle/CropCycleController';

/**
 * Here, you can register routes by instantiating the controller.
 *
 */
export default function registerRoutes(): Router {
	const router = Router();

	// Define an array of controller objects
	const controllers = [
		new OrganizationController(),
		new PropertyController(),
		new RegionController(),
		new FieldController(),
		new CropController(),
		new CropCycleController(),
	];

	// Dynamically register routes for each controller
	controllers.forEach((controller) => {
		// make sure each controller has basePath attribute and register() method
		router.use(`/v1/${controller.basePath}`, controller.register());
	});

	return router;
}
