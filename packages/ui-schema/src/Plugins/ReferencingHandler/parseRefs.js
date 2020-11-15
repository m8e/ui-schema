import {List, Map} from 'immutable';
import {resolveRef, SchemaRefPending} from '@ui-schema/ui-schema/Plugins/ReferencingHandler/resolveRef';

const handleResolve = (keywords, condition, schema, context, recursive, pending) => {
    Object.keys(keywords).forEach(keyword => {
        // schemaMap can be a `Map` or a `List`
        const schemaMap = schema.get(keyword)
        if(schemaMap && condition(schemaMap)) {
            schema = schema.set(keyword, schemaMap.map((subSchema) => {
                const res = parseRefs(subSchema, context, keywords[keyword] || recursive, pending)
                pending = res.pending
                return res.schema
            }));
        }
    })

    return {schema, pending}
}

// all keywords which nested schemas in maps
const checkNestedMapSchema = {
    properties: false,
}

// all keywords which are an array of schemas
const checkNestedArraySchema = {
    // here items are tuple-schema arrays
    items: false,
}

const parseRefsInRenderingKeywords = (schema, context, recursive, pending = Map()) => {
    // for all schema keywords which will be rendered, only the root references must be resolved,
    // but not if they are within an e.g. `if`
    // - e.g. references within `properties` doesn't need to be resolved before they are rendered
    let res = {schema, pending}

    res = handleResolve(
        checkNestedMapSchema, schemaMap => Map.isMap(schemaMap),
        res.schema, context, recursive, res.pending,
    )

    res = handleResolve(
        checkNestedArraySchema, schemaList => List.isList(schemaList),
        res.schema, context, recursive, res.pending,
    )

    // items is either a schema or a list of schemas,
    // here one-schema for all items
    const items = schema.get('items')
    if(items && Map.isMap(items)) {
        const itemsSchema = parseRefs(items, context, recursive, res.pending)
        res.schema = itemsSchema.schema
        res.pending = itemsSchema.pending
    }

    return res
}

// conditional keywords who must resolve recursive
const checkConditionalNestedMapSchema = {
    patternProperties: true,
    dependencies: false,
    dependentSchemas: false,
}

// all keywords which are an array of schemas
const checkConditionalNestedArraySchema = {
    allOf: false,
    oneOf: false,
    anyOf: false,
}

const checkSchema = {
    if: true,
    else: false,
    then: false,
    not: false,
    propertyNames: true,
    contains: true,
}

const parseRefsInConditionalKeywords = (schema, context, recursive = false, pending = Map()) => {
    // all schema keywords which are never rendered must be resolved endless-recursive
    // - e.g. `if` is used from within the ConditionalHandler, but it will never be rendered through `PluginStack`
    //   thus any `$ref` can not be resolved at render-flow, but must be resolved beforehand
    // for all schema keywords which may-be rendered, only the first level must be resolved, maybe configurable depth
    // - e.g. if `then` should be applied, this schema is merged into the current one, if it is only a reference
    //   and another `then` is applied and also just a reference, the first reference will be overwritten from the second one and is lost.
    //   when resolving the root ref in the `then`s, those schemas are merged into each other
    //   todo: how to handle references within `then` if they are nested, the specific references should use it's own `id` - but this would be lost after merging

    let res = {schema, pending}

    Object.keys(checkSchema).forEach(keyword => {
        const schemaCond = schema.get(keyword)
        if(schemaCond && Map.isMap(schemaCond)) {
            const resCheckSchema = parseRefs(schemaCond, context, checkSchema[keyword] || recursive, res.pending)
            res.schema = schema.set(keyword, resCheckSchema.schema);
            res.pending = resCheckSchema.pending
        }
    })

    res = handleResolve(
        checkConditionalNestedMapSchema, schemaMap => Map.isMap(schemaMap),
        res.schema, context, true, res.pending,
    )

    res = handleResolve(
        checkConditionalNestedArraySchema, schemaList => List.isList(schemaList),
        res.schema, context, recursive, res.pending,
    )

    return res
}

// todo: for JSON pointer resolving additionally, the root-schema or a `resolvePointer` callable, param will be needed
export const parseRefs = (schema, context, recursive = false, pending = Map()) => {
    const ref = schema.get('$ref')
    if(ref) {
        // 1. if schema is a reference itself, resolve it
        //    then with the next code, references in the reference are resolved
        try {
            schema = resolveRef(ref, context) || schema
        } catch(e) {
            if(e instanceof SchemaRefPending) {
                pending = pending.update(ref, (refPref = List()) => {
                    const v = schema.get('version') || '*'
                    if(!refPref.contains(v)) {
                        refPref = refPref.push(v)
                    }
                    return refPref
                })
            } else {
                throw e
            }
        }
    }

    let res = {schema, pending}

    // 2. handle conditionals
    res = parseRefsInConditionalKeywords(res.schema, context, recursive, res.pending)

    // 3. handle validation/applicator schema
    if(recursive) {
        res = parseRefsInRenderingKeywords(res.schema, context, recursive, res.pending)
    }

    return res
}
