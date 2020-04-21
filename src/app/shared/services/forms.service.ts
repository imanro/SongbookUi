import {SbFormErrors} from '../../shared/models/form-errors.model';
import {FormControl, FormGroup} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SbFormsService {

    bindErrors(errors: SbFormErrors, form: FormGroup, fieldMap?: any, skipFields?: any): any[] {

        let unmapped = [];

        console.log('PPPP', errors.fields, errors.common);

        for (const fieldError of errors.fields) {

            const fieldName = this.getFieldName(fieldError.name, fieldMap);
            if (skipFields && skipFields[fieldName] !== undefined) {
                unmapped.push(fieldError.messages.join(', '));
                continue;
            }

            const input = form.get(fieldName);

            if (!input || !(input instanceof FormControl)) {
                console.error('There is no such input', fieldName, 'in this form, could not bind an error');
                unmapped.push(fieldError.messages.join(', '));
                continue;
            } else {
                input.setErrors({server: fieldError.messages.join(', ')});
            }
        }

        unmapped = unmapped.concat(errors.common);
        return unmapped;
    }

    getFieldName(name, fieldMap: any) {
        if (fieldMap && fieldMap[name]) {
            return fieldMap[name];
        } else {

            let matches;
            if (matches = /^.+?\./.exec(name)) {
                console.log('found', matches);
                if (fieldMap && fieldMap[matches[0]]) {
                    return name.replace(matches[0], fieldMap[matches[0]]);
                } else {
                    return name;
                }
            } else {
                return name;
            }
        }

    }

    addFormError(errors: SbFormErrors, field: string, message: string) {

        for (const checkField of errors.fields) {
            if (checkField.name === field) {
                checkField.messages.push(message);
                return;
            }
        }

        errors.fields.push({name: field, messages: [message]});
    }
}
