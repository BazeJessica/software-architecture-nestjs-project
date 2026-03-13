import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateTagUseCase } from './create-tag.use-case';
import { TagRepository } from '../../domain/repository/tag.repository';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserUsername } from 'src/modules/users/domain/value-objects/user-username.value-object';
import { CreateTagDto } from '../dtos/create-tags.dto';
import { UserCannotCreateTagException } from '../../domain/exceptions/user-cannot-create-tag.exception';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagCreatedEvent } from '../../domain/event/tag-created.event';

describe('CreateTagUseCase', () => {
  let useCase: CreateTagUseCase;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let tagRepository: jest.Mocked<TagRepository>;

  beforeEach(() => {
    eventEmitter = {
      emit: jest.fn(),
    } as any;
    tagRepository = {
      createTag: jest.fn(),
      findByName: jest.fn(),
    } as any;

    useCase = new CreateTagUseCase(eventEmitter, tagRepository);
  });

  const getAdminUser = () => {
    return UserEntity.reconstitute({
      id: 'admin-id',
      username: 'admin',
      role: 'admin',
      password: 'password',
    });
  };

  const getReaderUser = () => {
    return UserEntity.reconstitute({
      id: 'reader-id',
      username: 'reader',
      role: 'user',
      password: 'password',
    });
  };

  it('should successfully create a tag when user is ADMIN and tag is valid', async () => {
    const dto: CreateTagDto = { name: 'typescript' };
    const admin = getAdminUser();

    tagRepository.findByName.mockResolvedValue(null);

    const tag = await useCase.execute(dto, admin);

    expect(tag).toBeDefined();
    expect(tag.name).toBe('typescript');
    expect(tagRepository.createTag).toHaveBeenCalledWith(tag);
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      TagCreatedEvent,
      expect.objectContaining({ tagId: tag.id, name: 'typescript' })
    );
  });

  it('should throw UserCannotCreateTagException if user is not ADMIN', async () => {
    const dto: CreateTagDto = { name: 'typescript' };
    const reader = getReaderUser();

    await expect(useCase.execute(dto, reader)).rejects.toThrow(UserCannotCreateTagException);
  });

  it('should throw an error if a tag with the same name already exists', async () => {
    const dto: CreateTagDto = { name: 'typescript' };
    const admin = getAdminUser();

    tagRepository.findByName.mockResolvedValue({} as TagEntity);

    await expect(useCase.execute(dto, admin)).rejects.toThrow('Tag with name typescript already exists');
  });

  it('should throw if tag name validation fails (min 2 chars)', async () => {
    const dto: CreateTagDto = { name: 't' };
    const admin = getAdminUser();

    tagRepository.findByName.mockResolvedValue(null);

    await expect(useCase.execute(dto, admin)).rejects.toThrow('Tag name too short (min 2 chars)');
  });
});
