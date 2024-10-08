import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalUserPersistenceModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, RelationalUserPersistenceModule],
})
export class UsersModule {}
