import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception';
export class UserCannotUpdateTagException extends DomainException {
  constructor() {
    super(
      'You do not have permission to update tags',
      'USER_CANNOT_UPDATE_TAGS',
    );
  }
}
