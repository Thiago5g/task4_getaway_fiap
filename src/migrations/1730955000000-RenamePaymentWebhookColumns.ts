import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePaymentWebhookColumns1730955000000
  implements MigrationInterface
{
  name = 'RenamePaymentWebhookColumns1730955000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename columns eventId -> evento_id, payload -> dados, createdAt -> criado_em
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME COLUMN "eventId" TO "evento_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME COLUMN "payload" TO "dados"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME COLUMN "createdAt" TO "criado_em"`,
    );
    // Rename unique constraint if necessary (depends on auto-generated name)
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME CONSTRAINT "UQ_payment_webhook_events_eventId" TO "UQ_payment_webhook_events_evento_id"`,
    );
    // Adjust index/constraint names if any other exist (primary key left intact)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME CONSTRAINT "UQ_payment_webhook_events_evento_id" TO "UQ_payment_webhook_events_eventId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME COLUMN "criado_em" TO "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME COLUMN "dados" TO "payload"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_webhook_events" RENAME COLUMN "evento_id" TO "eventId"`,
    );
  }
}
