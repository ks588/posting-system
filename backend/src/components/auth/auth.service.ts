import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { StripeService } from '../stripe/stripe.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly stripeService: StripeService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.UserId, roles: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        UserId: user.UserId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
  try {
    console.log('Registering user with:', createUserDto);
  
    const user = await this.userService.create(createUserDto);
    console.log('User created:', user);

    const payload = {username: user.username, sub: user.UserId, roles: user.role };
    const stripeCustomerId = await this.stripeService.createCustomer(user.UserId, user.email, user.username ?? undefined);

    const updatedUser = await this.userService.update(user.UserId, {
    CustomerId: stripeCustomerId,
});
    const token = this.jwtService.sign(payload);
    console.log('Generated token:', token);

    const output = {
      access_token: token,
      user : {
        UserId: updatedUser.UserId,
        username: updatedUser.username,
        email: updatedUser.email,
        role: user.role,
      },
    };

    console.log('Final output:', output);
    return output;
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    throw error;
  }
}

}
