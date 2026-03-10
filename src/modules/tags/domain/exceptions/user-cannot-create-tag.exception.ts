import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception';
export class UserCannotCreateTagException extends DomainException {
  constructor() {
    super(
      'You do not have permission to create tags',
      'USER_CANNOT_CREATE_TAGS',
    );
  }
}
