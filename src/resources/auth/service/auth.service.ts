import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/resources/usuarios/service/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      nome: user.nome,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // async changePassword(
  //   userId: number,
  //   currentPassword: string,
  //   newPassword: string,
  // ): Promise<{ message: string }> {
  //   const user = await this.userService.findById(userId);
  //   console.log(userId, currentPassword, newPassword);
  //   if (!user) {
  //     throw new NotFoundException('Usuário não encontrado.');
  //   }

  //   const isPasswordValid = await bcrypt.compare(
  //     currentPassword,
  //     user.password,
  //   );
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Senha atual incorreta.');
  //   }

  //   const newHashedPassword = await bcrypt.hash(newPassword, 10);

  //   await this.userService.updatePassword(userId, newHashedPassword);

  //   return { message: 'Senha alterada com sucesso.' };
  // }
}
