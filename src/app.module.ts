import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from 'database/data-source';
import { ConfigModule } from '@nestjs/config';
import { CurrentUserMiddleware } from 'utility/middlewares/current-user.middleware';
import { AuthModule } from './users/auth.module';
import { CourcesModule } from './cources/cources.module';
import { ProfilesModule } from './users/profile/profile.module';
import { ReviewsModule } from './cources/reviews/reviews.module';
import { ContactModule } from './users/mail/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    CourcesModule,
    ProfilesModule,
    ReviewsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
