# jasmine-shared-examples

My implementation of the shared examples pattern for jasmine on node.js.

## How it works

It inserts (and executes) any function defined by `shared_examples_for` at the point where
`it_behaves_like` is called. The shared examples definition function is wrapped by a `describe` with
the name of the shared examples used for the description of the `describe`.


## Installation

```sh
npm install --save-dev code_cowboy-jasmine-shared-examples
```

## Setup

Install the helper into `spec/helpers/shared-examples.js`:

```
node_modules/.bin/code_cowboy-jasmine-shared-examples init
```


## Usage

### Definition

```javascript
shared_examples_for("some aspect", () => {
  beforeEach(() => { … });

  it("does something", () => { … });
  …
});
```

### Utilization

```javascript
it_behaves_like("some aspect");
});
```

### Parametrize the shared examples

```javascript
shared_examples_for("some aspect", (arg1, arg2, …) => {
  beforeEach(() => {
    // You may use arg1 etc. here.
  });

  it("does something", () => {
    // You may use arg1 etc. here.
  });

  describe(`aspect ${arg1}`, () => { … });
});

it_behaves_like("some aspect", arg1, arg2, …);
```

### Extend the shared examples context

```javascript
it_behaves_like("some aspect", () => {
  // This gets called within the `describe` context.
  beforeEach(() => { … });
});
```

### Combine both

```javascript
it_behaves_like("some aspect", arg1, arg2, …, () => {
  beforeEach(() => { … });
});
```
