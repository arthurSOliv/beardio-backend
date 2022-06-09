import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ provider_id, month, year, day }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id: provider_id,
            day,
            month,
            year,
        });

        const hourStart = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );

        const availability = eachHourArray.map(hour => {
            const hasAppointmentsInHour = appointments.find(appointment => {
                return getHours(appointment.date) - 3 === hour;
            })

            const currentDate = new Date(Date.now());
            const compareDate = new Date(year, month - 1, day, hour);

            const test = !hasAppointmentsInHour && isAfter(compareDate, currentDate);

            return {
                hour,
                available: !hasAppointmentsInHour && isAfter(compareDate, currentDate),
            }
        })

        return availability;
    }
}

export default ListProviderDayAvailabilityService;