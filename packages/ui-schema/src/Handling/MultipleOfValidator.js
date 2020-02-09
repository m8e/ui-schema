import React from "react";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";

const ERROR_MULTIPLE_OF = 'multiple-of';

const validateMultipleOf = (type, schema, value) => {
    if((type === 'number' || type === 'integer') && typeof value !== 'undefined') {
        let multipleOf = schema.get('multipleOf');
        if(multipleOf && (value % multipleOf) !== 0) {
            return false;
        }
    }

    return true;
};

const MultipleOfValidator = (props) => {
    const {
        schema, value
    } = props;
    let {errors} = props;

    let {valid} = props;

    let type = schema.get('type');

    if(!validateMultipleOf(type, schema, value)) {
        valid = false;
        errors = errors.push(ERROR_MULTIPLE_OF);
    }

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {MultipleOfValidator, ERROR_MULTIPLE_OF, validateMultipleOf}