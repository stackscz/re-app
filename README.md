# `re-app`

common `react` components, `redux`, `react-router`, `redux-router`, `redux-saga` boilerplate and helper codebase


## Components

### `BlissComponent`

General purpose Css Bliss base component, which handles component className

Use as owner of your custom component:

    ...
    class Btn extends React.Component {
        render() {
            const {children, tag, name, ...other} = this.props;
            return (
                <BlissComponent tag="a" name="Btn" {...other}>
                    {children}
                </BlissComponent>
            )
        }
    }
    ...
    
then

    <Btn modifiers="lg mint" href="/foo">
        foo
    </Btn>
    
renders as
    
    <a className="Btn Btn--lg Btn--mint" href="/foo">
        foo
    </a>
