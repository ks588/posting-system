import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './components/post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { TypesenseModule } from './common/typesense/typesense.module';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import { PlansModule } from './components/plans/plans.module';
import { StripeModule } from './components/stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionModule } from './components/subscription/subscription.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    PrismaModule,
    TypesenseModule,
    UserModule,
    AuthModule,
    PlansModule,
    StripeModule,
    SubscriptionModule,

  ] //Imports
})
export class AppModule {}
