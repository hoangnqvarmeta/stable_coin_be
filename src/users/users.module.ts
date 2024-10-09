import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalUserPersistenceModule],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService, RelationalUserPersistenceModule],
})
export class UsersModule {}
