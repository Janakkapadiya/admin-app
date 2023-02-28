import { ConfigModule } from '@nestjs/config';

export const rootConfigModule = ConfigModule.forRoot({
  envFilePath: 'src/key.env',
  isGlobal: true,
});
