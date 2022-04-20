import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { CommonService } from './common.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [JwtStrategy, CommonService],
  exports: [
    {
      provide: JwtStrategy,
      useClass: JwtStrategy,
      inject: [ConfigModule],
    },
    CommonService,
  ],
})
export class CommonModule {}