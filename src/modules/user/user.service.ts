import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'

import { User, UserDocument } from './schema/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from '../auth/dto/login.dto'

@Injectable()
export class UserService {
  @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(body: CreateUserDto): Promise<User> {
    return this.userModel.create(body)
  }

  async login(body: LoginDto): Promise<any> {
    const user = await this.getByUsername(body.username)
    return this.createToken(user)
  }

  async getAllUser(): Promise<User[]> {
    return this.userModel.find({}).select({ _id: 0, password: 0 })
  }

  async createToken(user: UserDocument) {
    const jwtOptions: JwtSignOptions = {
      secret: this.configService.get<string>('authentication.secret'),
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          objectId: user.objectId,
          username: user.username,
        },
        jwtOptions,
      ),
      this.jwtService.signAsync(
        {
          objectId: user.objectId,
          username: user.username,
        },
        jwtOptions,
      ),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async getByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username })
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email })
  }
}
