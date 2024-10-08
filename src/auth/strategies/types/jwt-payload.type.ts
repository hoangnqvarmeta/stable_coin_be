import { Session } from '../../../session/domain/session';
import { User } from '../../../users/domain/user';

export type JwtPayloadType = Pick<User, 'id' | 'publicAddress'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
