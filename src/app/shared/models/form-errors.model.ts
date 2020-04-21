export class SbFormErrors {
    common: any[] = [];
    fields: {[key: string]: any}[] = [];

    assignServerFieldErrors(errors: { [key: string]: any }[]) {
        this.fields = [];

        if (errors) {
            for (const error of errors) {
                this.fields.push({name: error.propertyPath, messages: [error.message]});
            }
        }
    }
}
