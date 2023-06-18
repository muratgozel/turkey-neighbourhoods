# Contributing
Thanks for your interest in contributing to this repository. Please take a moment to review this document **before submitting a pull request.**

<br>

## Table of Contents
1. [Cloning the repository](#cloning-the-repository)
2. [Installing Node.js](#installing-nodejs)
3. [Installing dependencies](#installing-dependencies)
4. [Setting up](#setting-up)
5. [Running the test suite](#running-the-test-suite)
6. [Making your updates](#making-your-updates)
7. [Reviewing and declaring types](#reviewing-and-declaring-types)
8. [Reviewing and writing tests](#reviewing-and-writing-tests)
9. [Reviewing and writing documentation](#reviewing-and-writing-documentation)
10. [Committing your changes](#committing-your-changes)
11. [Submitting a pull request](#submitting-a-pull-request)

<br>

---

<br>

## Cloning the repository
To start contributing to the project, fork it first and then clone your fork to your local machine using git:

```bash
git clone https://github.com/[YOUR_USERNAME][REPO_NAME].git
```

Or the [GitHub CLI](https://cli.github.com):

```bash
gh repo clone [YOUR_USERNAME][REPO_NAME]
```

## Installing Node.js
This project requires node.js with a certain minimum version specified in [package.json](package.json).

You can run the following commands in your terminal to check your local node.js version:

```bash
node -v
```

If the versions are not correct or you don't have Node.js or pnpm installed, download and follow their setup instructions:
- Install Node.js using [fnm](https://github.com/Schniz/fnm) or from the [official website](https://nodejs.org)

## Installing dependencies
Once in the project's root directory, run the following command to install the project's dependencies:

```bash
npm install
```

## Setting up
Use `npm` to run the following commands:

```bash
npm run setup && npm run compile && npm run build
```

## Running the test suite
To make sure that the whole setup went well, run the test suite:

```bash
npm test
```

## Making your updates
There are different kind of contributions. It could be a simple README update, a bug fix in the code or a new feature. Depending on the type of your contribution, you may need to take additional steps as mentioned below.

Work on the update you wish to be merged with this repository.
- Pay attention to code style used by the project.

## Reviewing and declaring types
We recommend codebase to be strongly typed. All the types declared in [types](types) folder. If you
- implemented a new feature
- changed an existing code
- changed types
please review the types and make sure they are correct and write new types if necessary. Project won't compile otherwise.

## Reviewing and writing tests
We try to keep 70-80% of the codebase covered by the tests. All the tests are in [tests](tests) folder. If you
- implemented a new feature
- changed an existing code
please review the tests and make sure they are correct and write new tests if necessary.

## Reviewing and writing documentation
The project has a [README.md](README.md) and an automated documentation tool called `typedoc`. While typedoc can reflect any of the changes you made in the code in an automated way, the readme may need to be updated manually. We recommend you to review the readme and look for anything needs to be updated regarding the changes you made.

## Committing your changes
Run the following commands before committing your changes:
```bash
npm run compile && npm run build
npm run test
npm run docs
```

And then commit and push your changes to your forked repository:
```bash
git commit -m "your message" -m "you can add more messages"
git push --atomic origin master
```
You can use your IDE to commit and push if it supports.

## Submitting a pull request
When creating a pull request:
- Make your title meaningful (Add something, Fix something etc.)

That's all.

Your contribution will be reviewed depending on the availability of maintainers.
