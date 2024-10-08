---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.ts
---
import { ApiProperty } from '@nestjs/swagger';
import { BaseDomain } from '@/database/common/BaseDomain';

export class <%= name %> extends BaseDomain {
  @ApiProperty({
    type: String,
  })
  id: string;
}
