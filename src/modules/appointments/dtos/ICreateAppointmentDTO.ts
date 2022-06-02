export default interface ICreateAppointmentDTO {
    provider_id: string;
    client_id: string;
    date: Date;
    client_name?: string;
}