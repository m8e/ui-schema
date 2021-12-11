import React from 'react'
import { TransTitle, WidgetProps } from '@ui-schema/ui-schema'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer'
import Box from '@material-ui/core/Box'
import Typography, { TypographyProps } from '@material-ui/core/Typography'

export const LabelBox = (props: WidgetProps): React.ReactElement => {
    const {schema, storeKeys, ownKey} = props

    return <Box
        mt={schema.getIn(['view', 'mt']) as number}
        mr={schema.getIn(['view', 'mr']) as number}
        mb={schema.getIn(['view', 'mb']) as number}
        ml={schema.getIn(['view', 'ml']) as number}
        pt={schema.getIn(['view', 'pt']) as number}
        pr={schema.getIn(['view', 'pr']) as number}
        pb={schema.getIn(['view', 'pb']) as number}
        pl={schema.getIn(['view', 'pl']) as number}
    >
        {schema.getIn(['view', 'hideTitle']) ? null : <Typography
            gutterBottom
            variant={(schema.getIn(['view', 'titleVariant']) as TypographyProps['variant']) || 'h5'}
            component={(schema.getIn(['view', 'titleComp']) as React.ElementType) || 'p'}
        >
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </Typography>}
        {/* todo: add `description` support */}
        <ObjectRenderer {...props}/>
    </Box>
}
