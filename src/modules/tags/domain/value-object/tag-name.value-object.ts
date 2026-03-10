export class TagName{
    private readonly value: string;

    constructore(name: string){
        this.validate(name);
        this.value = name.trim();
    }

    private validate(name: string): void{
        if(!name || name.trim().length === 0){
            throw new Error('Tag name cannot be empty');
        }

        if(name.length >= 50 ){
            throw new Error('Tag name too long (max 49 chars)');
        }

        if(name.length < 3){
            throw new Error('Tag name too short (min 3 chars)');
        }

        const regex=/^[a-z0-9-]+$/;
        if(!regex.test(name)){
            throw new Error('TagName must only contain lowercase alphanumeric characters and hyphens')
        }

        public toString(): string{
            return this.value;
        }
    }
}