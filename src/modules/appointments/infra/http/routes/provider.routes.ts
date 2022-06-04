import { Router } from "express";

import ensureAuthenticated from "@shared/infra/http/middlewares/ensureAuthenticated";
import ProvidersController from "../controllers/ProvidersController";
import ProviderDayAvailabilityController from "../controllers/ProviderDayAvailabilityController";
import ProviderMonthAvailabilityController from "../controllers/ProviderMonthAvailabilityController";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerAppointmentsController = new ProviderAppointmentsController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.list);
providersRouter.get('/get/:user_id', providersController.findById);
providersRouter.get('/me', providerAppointmentsController.list);
providersRouter.get('/:provider_id/day-availability', providerDayAvailabilityController.list);
providersRouter.get('/:provider_id/month-availability', providerMonthAvailabilityController.list);

export default providersRouter;