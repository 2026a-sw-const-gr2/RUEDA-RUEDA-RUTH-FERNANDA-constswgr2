import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AppService } from './app.service';
import { EventsModule } from './modules/events/events.module';
import { HealthModule } from './modules/health/health.module';
import { PlatosTipicosModule } from './modules/platos-tipicos/platos-tipicos.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    DatabaseModule,
    EventsModule,
    HealthModule,
    StatsModule,
    PlatosTipicosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
