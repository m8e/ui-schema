import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import MuiFormGroup from '@material-ui/core/FormGroup'
import { useTheme } from '@material-ui/core/styles'

export const FormGroup: React.ComponentType<WidgetProps> = (props) => {
    const {storeKeys, ownKey, widgets} = props
    const {WidgetRenderer} = widgets
    const {spacing} = useTheme()
    let {schema} = props
    // deleting the `widget` to directly use `PluginStack` for nesting
    // with `widget` it would lead to an endless loop
    // using e.g. default `object` renderer then
    schema = schema.delete('widget')
    return <FormControl
        component="fieldset"
        style={{
            display: 'block',
            marginBottom: spacing(1),
        }}
    >
        <FormLabel component="legend">
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </FormLabel>
        <MuiFormGroup
            style={{
                marginTop: spacing(1),
                marginBottom: spacing(1),
            }}
        >
            <WidgetRenderer {...props} schema={schema}/>
        </MuiFormGroup>
        {/*<FormHelperText>Be careful</FormHelperText>*/}
    </FormControl>
}
