import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlacaToVeiculos1730906000000 implements MigrationInterface {
  name = 'AddPlacaToVeiculos1730906000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "veiculos" ADD COLUMN "placa" varchar UNIQUE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "veiculos" DROP COLUMN "placa"');
  }
}
