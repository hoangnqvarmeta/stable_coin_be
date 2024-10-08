import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transfer_events')
export class TransactionEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @PrimaryGeneratedColumn()
  public eventId: string;

  @Column({ nullable: false })
  public contractAddress: string;

  @Column({ nullable: false })
  public txHash: string;

  @Column({ nullable: true })
  action: string;

  @Column({ nullable: true })
  from: string;

  @Column({ nullable: true })
  to: string;

  @Column({ nullable: false })
  public price: string;

  @Column({ type: 'bigint', nullable: true })
  public blockNumber: number;

  @Column({ length: 100, nullable: true })
  public blockHash: string;
}
