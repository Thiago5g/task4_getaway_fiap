import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentWebhookEvents1730950000000
  implements MigrationInterface
{
  name = 'CreatePaymentWebhookEvents1730950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "payment_webhook_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventId" character varying(150) NOT NULL, "payload" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_payment_webhook_events_eventId" UNIQUE ("eventId"), CONSTRAINT "PK_payment_webhook_events_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_webhook_events"`);
  }
}
