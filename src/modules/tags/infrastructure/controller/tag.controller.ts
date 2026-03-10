import { Controller } from "@nestjs/common";
import { CreateTagUseCase } from "../../application/use-cases/create-tag.use-case";
import { UpdateTagUseCase } from "../../application/use-cases/update-tag.use-case";
import { DeleteTagUseCase } from "../../application/use-cases/delete-tag.use-case";
import { GetTagUseCase} from "../../application/use-cases/get-tag.use-case"

@ApiTags('Tags')
@Controller('tags')
export class TagController {
    constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly getAllTagUseCae: GetTagUseCase,
    ){}

    @Post()

}