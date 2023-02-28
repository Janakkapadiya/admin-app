import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mailgun from 'mailgun-js';
import { MailgunData } from './dto/mailgun.data';

@Injectable()
export class EmailService {
  private mg: Mailgun.Mailgun;

  constructor(private readonly configService: ConfigService) {
    this.mg = Mailgun({
      apiKey: this.configService.get<string>('API_KEY'),
      domain: this.configService.get<string>('API_DOMAIN'),
    });
  }

  send(data: MailgunData): Promise<Mailgun.messages.SendResponse> {
    return new Promise((res, reject) => {
      this.mg.messages().send(data, (error, body) => {
        if (error) reject(error);
        res(body);
      });
    });
  }
}
