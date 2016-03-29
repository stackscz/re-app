# `re-app`

common `react` components, `redux`, `react-router`, `redux-router`, `redux-saga` boilerplate and helper codebase


## Components

### `BlissComponent`

General purpose Css Bliss base component, which handles component className.

Use it to decorate your custom component:

    ...
    @BlissComponent
    class Btn extends React.Component {
        render() {
            const {getBlissModuleClassName: bm, getBlissElementClassName: be} = this.props;
            return (
                <button className={bm()}>
                    <i className={be('icon')}></i>
                    {children}
                    <i className={be('icon', 'after lg')}></i>
                </button>
            )
        }
    }
    ...
    
then

    <Btn modifiers="lg mint" href="/foo">
        foo
    </Btn>
    
renders as
    
    <button class="Btn Btn--lg Btn--mint" href="/foo">
        <i class="Btn-icon"></i>
        foo
        <i class="Btn-icon Btn-icon--after Btn-icon--lg"></i>
    </button>

## Testing

Tests are stored in `tests` folder. Run them by executing `npm run test` (you have to have `babel-node` installed globally, `npm install -g babel-node`).
You can also run only one test file by running `npm run test:file path/to/test`.

## TODO

- memoized selector helper(s)
- consider immutable.js
- saga helper(s)
- tests
