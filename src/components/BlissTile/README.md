# `css-bliss-react-style-tile`

Generate showcase of your `react` component styled in accordance with *awesome* [`css-bliss`](https://github.com/gilbox/css-bliss) css style guide

Throw together your stylesheet:

    // components/Button/index.sass
    .Button
      background: gray
    
    .Button--block
      display: block
      width: 100%
    
    .Button--lg
      font-size: 20px

Create some instances of example props for component

    // examples/props/Button.js
    export default [
        {
            children: 'Button text',
        },
        {
            children: 'Button text',
            icon: <i className="fa fa-star" />,
        },
    ];

Then use `Tile` component.

    import Button from 'components/Button';
    import ButtonPropsExamples from 'examples/props/Button.js';
    import ButtonCSS from '!!raw!sass!components/Button/index.sass';

    const tile = (
        <Tile
            componentName="Button"
            componentModule={Button}
            stylesheet={ButtonCSS}
            propExamples={ButtonPropsExamples}
        />
    )

This will render style tile of `Button` component with examples 
of all possible combinations of modifiers defined in stylesheet and 
all instances of example props in addition to `Button`'s `defaultProps`.

Example buttons rendered:

    // defaultProps
    <Button />
    <Button modifiers="block" />
    <Button modifiers="lg" />
    <Button modifiers="block lg" />
    
    // example props [0]
    <Button>
        Button text
    </Button>
    <Button modifiers="block">
        Button text
    </Button>
    <Button modifiers="lg">
        Button text
    </Button>
    <Button modifiers="block lg">
        Button text
    </Button>
    
    // example props [1]
    <Button 
        icon={<i className="fa fa-star" />}
    >
        Button text
    </Button>
    <Button 
        modifiers="block"
        icon={<i className="fa fa-star" />}>
    >
        Button text
    </Button>
    <Button 
        modifiers="lg"
        icon={<i className="fa fa-star" />}>
    >
        Button text
    </Button>
    <Button 
        modifiers="block lg"
        icon={<i className="fa fa-star" />}>
    >
        Button text
    </Button>

## `@mutex`es

If number of all combinations of modifiers exceeds given limit,
only one modifier at a time is used. In that case, you will not see 
how your modifiers play when used together.
By applying `@mutex` annotation on your module modifier class you can 
tell which modifiers are mutually exclusive. 
For example `lg` and `sm` modifiers do not make sense when used together.

    .Button
      background: gray
    
    .Button--block
      display: block
      width: 100%
    
    .Button--lg
      /* @mutex size */
      font-size: 20px
    
    .Button--sm
      /* @mutex size */
      font-size: 10px
    
    .Button--primary
      /* @mutex type */
      background: blue
    
    .Button--secondary
      /* @mutex type */
      background: red

Only sensible combinations will then be generated. **More importantly 
this also describes your modifiers to make sure you understand their 
meaning well!**

Happy coding!
