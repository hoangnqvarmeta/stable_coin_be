import { ApiResponseProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseDomain {
  @ApiResponseProperty({
    type: Date,
    example: '2022-08-16T11:33:41.000Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date | null;

  @ApiResponseProperty({
    type: Date,
    example: '2022-08-16T11:33:41.000Z',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date | null;
}
