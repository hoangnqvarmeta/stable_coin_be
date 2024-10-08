import { EntityRelationalHelper } from '@/utils/relational-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity extends EntityRelationalHelper {
  @ApiResponseProperty()
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | null;

  @ApiResponseProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = new Date();
  }
}
