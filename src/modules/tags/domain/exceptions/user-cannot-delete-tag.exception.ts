import { DomainException } from 'src/modules/shared/errors/domain/exceptions/domain.exception';
export class UserCannotDeleteTagException extends DomainException {
  constructor() {
    super(
      'You do not have permission to delete tags',
      'USER_CANNOT_DELETE_TAGS',
    );
  }
}
