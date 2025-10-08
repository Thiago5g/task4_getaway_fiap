import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('payment_webhook_events')
export class PaymentWebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'evento_id', type: 'varchar', length: 150 })
  eventoId: string;

  @Column({ name: 'dados', type: 'jsonb' })
  dados: any;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}
