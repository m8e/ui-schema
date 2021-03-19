import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {InvertColors as InvertColorsIcon} from '@material-ui/icons';
import GithubLogo from '../asset/GithubLogo';
import {Link as RouterLink} from 'react-router-dom';
import {AccessTooltipIcon} from '@control-ui/core/es/Tooltip';
import Typography from '@material-ui/core/Typography';
import {LinkIconButton} from '@control-ui/core/es/LinkIconButton';
import {Header} from '@control-ui/layouts/es/default/Header';
import {useSwitchTheme} from '@control-ui/core/es/Provider/AppTheme';
import {Drawer} from '@control-ui/layouts/es/default/Drawer';
import {useDrawer} from '@control-ui/core/es/Provider/DrawerProvider';
import {ListItemIcon, ListItemLink} from '@control-ui/core/es/Link';
import {Logo} from '../asset/logo';
import {schemas} from '../schemas/_list';
import ListItemText from '@material-ui/core/ListItemText';
import {ExpandLess, ExpandMore} from '@material-ui/icons';
import {Divider, List, Collapse} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import {NavListNested} from '@control-ui/core/es/NavList';
import {routesDocs, routesWidgets} from '../content/docs';

export const CustomHeader = ({title}) => {
    const {switchTheme} = useSwitchTheme();
    return <Header>
        <RouterLink to={'/'}>
            <Logo width={26} style={{marginLeft: 6, display: 'block'}}/>
        </RouterLink>

        {title ? <Typography component="h1" variant="h6" style={{flexShrink: 0, margin: '0 auto'}}>
            {title}
        </Typography> : null}

        <LinkIconButton size={'medium'} to={'https://github.com/ui-schema/ui-schema'} color="inherit" style={{color: 'inherit', marginLeft: title ? 0 : 'auto'}}>
            <GithubLogo fill='currentColor'/>
            <span className={'sr-only'}>To Github</span>
        </LinkIconButton>

        <IconButton color="inherit" onClick={switchTheme}>
            <AccessTooltipIcon title={'Switch Theme'}>
                <InvertColorsIcon/>
            </AccessTooltipIcon>
        </IconButton>
    </Header>;
};

const CollapseDrawer = ({toggle, icon, children, dense, style = undefined}) => {
    const {open, setOpen} = useDrawer()

    return <React.Fragment>
        <ListItem button onClick={() => setOpen(o => !o)} dense={dense} style={style}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={toggle}/>
            {open ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
            {children}
        </Collapse>
    </React.Fragment>
};

export const CustomDrawer = () => {
    const {setOpen} = useDrawer()
    return <Drawer drawerWidth={260}>
        <List>
            <ListItemLink to={'/'} primary={'Home'} dense showActive/>
            <ListItemLink to={'/quick-start'} primary={'Quick-Start'} dense showActive/>
            <ListItemLink to={'/examples'} primary={'Live Editor'} dense showActive/>

            <NavListNested
                routes={[routesDocs]}
                dense
                filter={() => true}
            />
            <NavListNested
                routes={[routesWidgets]}
                dense
                filter={() => true}
            />

            <CollapseDrawer toggle={'Schema Examples'} dense>
                <List component="div" disablePadding style={{overflow: 'auto'}}>
                    {schemas.map((schema, i) => (
                        <ListItemLink
                            key={i} to={'/examples/' + (schemas[i][0].split(' ').join('-'))}
                            primary={schema[0]} style={{paddingLeft: 24}} dense showActive/>
                    ))}
                </List>
            </CollapseDrawer>
            <Divider/>
            <ListItemLink to={'/impress'} primary={'Impress'} dense showActive/>
            <ListItemLink to={'/privacy'} primary={'Privacy Policy'} dense showActive/>
            <Divider/>
        </List>
    </Drawer>;
};
