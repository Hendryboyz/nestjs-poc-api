import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configurations from './configurations';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('postgres.host'),
        port: config.get<number>('postgres.port'),
        username: config.get<string>('postgres.user'),
        password: config.get<string>('postgres.password'),
        database: config.get<string>('postgres.dbName'),
        entities: [],
        synchronize: config.get<string>('env') !== 'production',
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
