import { Router } from "express";

import ensureAuthenticated from "@shared/infra/http/middlewares/ensureAuthenticated";
import AppointmentController from "../controllers/AppointmentController";

const appointmentsRouter = Router();
const appointmentController = new AppointmentController();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//     const appointmentsRepository = new AppointmentsRepository();
//     const appointments = await appointmentsRepository.find();

//     return response.json(appointments);
// })

appointmentsRouter.post('/', appointmentController.create);

export default appointmentsRouter;