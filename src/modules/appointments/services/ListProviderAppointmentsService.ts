import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  year: number;
  month: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepositiry: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    year,
    month,
  }: IRequest): Promise<Appointment[]> {
    let appointments = await this.appointmentsRepositiry.findAllInDayFromProvider(
      {
          provider_id,
          day,
          year,
          month,
      },
    );

    if(appointments.length > 0) {
      return appointments;
    }

    appointments = await this.appointmentsRepositiry.findAllInDayFromClient(
      {
          provider_id,
          day,
          year,
          month,
      },
    );

    return appointments;
  }
}

export default ListProviderAppointmentsService;