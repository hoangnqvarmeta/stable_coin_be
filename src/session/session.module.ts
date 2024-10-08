import { Module } from '@nestjs/common';
import { RelationalSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SessionService } from './session.service';
import { UsersModule } from '../users/users.module';

const infrastructurePersistenceModule = RelationalSessionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}
