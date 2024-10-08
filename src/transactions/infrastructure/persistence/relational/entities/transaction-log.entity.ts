import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transfer_log')
export class TransferLog {
  @PrimaryGeneratedColumn()
  public id: number;

  @PrimaryGeneratedColumn()
  public eventId: string;

  @Column({ nullable: false })
  public contractAddress: string;

  @Column({ nullable: true })
  action: string;

  @Column({ nullable: true })
  from: string;

  @Column({ nullable: true })
  to: string;

  @Column({ nullable: false })
  public price: string;

  @Column({ length: 100, nullable: true })
  txHash: string;

  @Column({ type: 'bigint', nullable: true })
  public blockNumber: number;

  @Column({ length: 100, nullable: true })
  public blockHash: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
