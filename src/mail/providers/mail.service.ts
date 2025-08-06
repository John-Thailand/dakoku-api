import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendUserWelcome(user: User, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: `StarryBase LLC <no-reply@starrybase.com>`,
      subject: 'Welcome to StarryBase LLC',
      template: './welcome',
      context: {
        email: user.email,
        emailVerifiedUrl: `http://localhost:3000/auth/verify-email?token=${token}`,
      },
    });
  }

  public async sendEmailChange(user: User, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: `StarryBase LLC <no-reply@starrybase.com>`,
      subject: `We've updated email address on your account`,
      template: './update-email',
      context: {
        email: user.email,
        emailVerifiedUrl: `http://localhost:3000/auth/verify-email?token=${token}`,
      },
    });
  }
}
