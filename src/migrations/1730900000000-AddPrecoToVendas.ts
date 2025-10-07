import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrecoToVendas1730900000000 implements MigrationInterface {
  name = 'AddPrecoToVendas1730900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendas" ADD "preco" numeric NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendas" ALTER COLUMN "preco" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vendas" DROP COLUMN "preco"`);
  }
}
