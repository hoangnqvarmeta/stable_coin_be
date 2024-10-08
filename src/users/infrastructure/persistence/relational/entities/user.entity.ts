import { BaseEntity } from '@/database/common/BaseEntity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'Unique wallet address of the user',
  })
  publicAddress: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'Unique wallet address of the user',
  })
  privateAddress: string;
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'Unique wallet address of the user',
  })
  mnemonic: string;
}
