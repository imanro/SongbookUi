export class AppDataFilterWhere {

    search?: string;

    private fields?: AppDataFilterWhereFieldDef[] = [];

    addField(name: string, value: any, op?: string): AppDataFilterWhere {

        if (typeof op === 'undefined') {
            op = AppDataFilterWhereFieldOpEnum.OP_EQ;
        }

        const def = new AppDataFilterWhereFieldDef();
        def.field = name;
        def.value = value;
        def.op = op;


        this.fields.push(def);
        return this;
    }

    getFields(): AppDataFilterWhereFieldDef[] {
        return this.fields;
    }

    getFieldDef(name: string): AppDataFilterWhereFieldDef {
        if (this.fields) {
            for (const row of this.fields) {
                if (row.field === name) {
                    return row;
                }
            }
        }

        return null;
    }
}

export class AppDataFilterWhereFieldDef {
    field: string;
    value: any;
    op: string;
}

export enum AppDataFilterWhereFieldOpEnum {
    OP_LIKE = 'like',
    OP_EQ = '=',
    OP_NEQ = '!=',
    OP_IN = 'in',
    OP_NIN = 'nin',
}
