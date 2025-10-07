import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entity/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
  ) {}

  async findByEmail(email: string): Promise<Usuario | undefined> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Usuario | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
