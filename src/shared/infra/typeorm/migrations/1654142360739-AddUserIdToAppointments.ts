import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
  } from 'typeorm';
  
  export default class AddUserIdToAppointments1654142360739
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'appointments',
        new TableColumn({
          name: 'client_id',
          type: 'uuid',
          isNullable: true,
        }),
      );
  
      await queryRunner.createForeignKey(
        'appointments',
        new TableForeignKey({
          name: 'AppointmentUser',
          columnNames: ['client_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('appointments', 'AppointmentUser');
      await queryRunner.dropColumn('appointments', 'user_id');
    }
  }