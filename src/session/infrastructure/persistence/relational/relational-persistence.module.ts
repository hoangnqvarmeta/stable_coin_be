import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { SessionRepository } from '../session.repository';
import { SessionEntity } from './entities/session.entity';
import { SessionRelationalRepository } from './repositories/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity, UserEntity])],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionRelationalRepository,
    },
  ],
  exports: [SessionRepository],
})
export class RelationalSessionPersistenceModule {}
