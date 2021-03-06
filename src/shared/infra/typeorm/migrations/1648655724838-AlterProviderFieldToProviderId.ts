import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterProviderFieldToProviderId1648655724838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('appointments', 'provider');

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider_id',
            type: 'uuid',
            isNullable: true
        }))

        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
              name: 'ProviderAppointment',
              columnNames: ['provider_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'users',
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('appointments', 'ProviderAppointment');

        await queryRunner.dropColumn('appointments', 'provider_id');

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider',
            type: 'varchar',
        }))
    }

}
