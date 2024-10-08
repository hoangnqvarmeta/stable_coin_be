import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class AuthWalletService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  // async getProfileByToken(
  //   loginDto: AuthGoogleLoginDto,
  // ): Promise<SocialInterface> {
  //   const ticket = await this.google.verifyIdToken({
  //     idToken: loginDto.idToken,
  //     audience: [
  //       this.configService.getOrThrow('google.clientId', { infer: true }),
  //     ],
  //   });

  //   const data = ticket.getPayload();

  //   if (!data) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         user: 'wrongToken',
  //       },
  //     });
  //   }

  //   return {
  //     id: data.sub,
  //     email: data.email,
  //     firstName: data.given_name,
  //     lastName: data.family_name,
  //   };
  // }
}
