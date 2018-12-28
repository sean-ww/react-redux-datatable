## Contributors Guide

### Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Commit and push your changes
5. Create a pull request

### Setup

```
git clone https://github.com/sean-ww/react-redux-datatable.git
cd react-redux-datatable
npm install
```

### Development

You can get started with development by using storybook.

First generate some data:
```
npm run storybook:init
```

Then run the storybook:
```
npm run storybook
```

You can then go to the provided localhost link.

### Adding New Stories

If you introduce a new feature, it is likely that it will be beneficial to add a new storybook story to demonstrate the new functionality.

All stories should be added to the `src/example/src/stories` folder, with an entry in the `index.story.jsx` file.

Most stories can make use of the existing story component `src/example/src/components/Story`.

See `src/example/src/stories/tableSettings/BasicTable.jsx` for an example.

Everything within the sourceCode prop will be shown as a code example underneath the component example implementation.

### Running Tests

Before committing any code you should ensure the existing tests still pass by running:
```
npm test
```

Additionally, you may need to add tests to cover new code you might introduce.

Tests should be written using [Chai Expect](https://www.chaijs.com/) assertions.

Test files can be added alongside components in the same folder, appended by `.test.jsx`.
For instance:
```
src/LoadingGif/LoadingGif.jsx
src/LoadingGif/LoadingGif.test.jsx
```

### Linting

When building the application linting will also take place according to the .eslintrc file, and errors where possible will be automatically fixed.

In order to better comply with the code style, it is best to use eslint with the .eslintrc config locally within your editor also.
