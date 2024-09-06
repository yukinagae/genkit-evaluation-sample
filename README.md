# genkit-evaluation-sample

- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Making Changes](#making-changes)
- [License](#license)

## Requirements

Before you start, make sure you have these installed:

- **Node.js** version 22 or later
- **npm**
- **Genkit**

For Genkit installation, see the [official guide](https://firebase.google.com/docs/genkit/get-started).

Check your installations by running:

```bash
$ node --version # the below version is on my environment
v22.7.0
$ npm --version # the below version is on my environment
10.8.2
$ genkit --version # the below version is on my environment
0.5.10
```

## Setup

**Install Project Dependencies**: Open your terminal, navigate to this project's folder, and run:

```bash
$ npm install
```

## Usage

1. **Set the `GOOGLE_GENAI_API_KEY` Environment Variable**

Before running the project, you need to provide your Gemini API key. This key allows your application to communicate with Gemini's services. Replace `your_api_key` with the actual API key you obtained from Gemini.

```bash
$ export GOOGLE_GENAI_API_KEY=your_api_key
```

2. **Run the Genkit server locally**

This command starts the project and automatically opens your default web browser to http://localhost:4000.

```bash
$ genkit start -o
```

Now you can play with it!

## Making Changes

### Building the Project

After making changes, you might need to build the project to see your changes in action:

```bash
$ npm run build
```

### Formatting and Linting

To ensure your code follows the project's coding standards, run the formatting and linting tools:

```bash
$ npm run typecheck # type check without modifying files
$ npm run check     # scan without modifying files
$ npm run fix       # modify files
```

### Kill Existing Processes

Sometimes existing processes are still running, preventing you from running genkit locally because the ports are already in use. In that case, run the following command to kill the processes tied to the ports:

```bash
$ npm run kill
```

## License

MIT
