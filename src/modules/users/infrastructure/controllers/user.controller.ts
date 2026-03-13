import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from '../../domain/entities/user.entity';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from '../../application/use-cases/get-followers.use-case';
import { GetFollowingUseCase } from '../../application/use-cases/get-following.use-case';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly unfollowUserUseCase: UnfollowUserUseCase,
    private readonly getFollowersUseCase: GetFollowersUseCase,
    private readonly getFollowingUseCase: GetFollowingUseCase,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Return all users.' })
  public async listUsers() {
    const users = await this.listUsersUseCase.execute();
    return users.map((u) => u.toJSON());
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return user by ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  public async getUserById(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return user?.toJSON();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  public async createUser(@Body() input: CreateUserDto) {
    return this.createUserUseCase.execute(input);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  public async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(id, input);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  public async deleteUser(@Param('id') id: string) {
    return this.deleteUserUseCase.execute(id);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'User followed successfully.' })
  public async followUser(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    await this.followUserUseCase.execute(user.id, id);
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User unfollowed successfully.' })
  public async unfollowUser(
    @Param('id') id: string,
    @Requester() user: UserEntity,
  ) {
    await this.unfollowUserUseCase.execute(user.id, id);
  }

  @Get(':id/followers')
  @ApiResponse({ status: 200, description: 'Return user followers.' })
  public async getFollowers(@Param('id') id: string) {
    const followers = await this.getFollowersUseCase.execute(id);
    return followers.map((u) => u.toJSON());
  }

  @Get(':id/following')
  @ApiResponse({ status: 200, description: 'Return users followed by this user.' })
  public async getFollowing(@Param('id') id: string) {
    const following = await this.getFollowingUseCase.execute(id);
    return following.map((u) => u.toJSON());
  }
}
