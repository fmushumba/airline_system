# Testing Documentation

## Overview
This document provides instructions and necessary information for running integration and unit tests in our project.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
Before running the integration tests, ensure you have the following installed:
- **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- **Dependencies**: After cloning the repository, you can install the necessary dependencies by navigating to the project directory and running:
  ```bash
  npm install
  
  ```
  ```bash
  git clone https://yourprojectrepository.com/yourproject.git

  ```

  ```bash
  cd airline_app

  ```

  ```bash
  npm run test:integration

  ```
  ## Built With
This project uses the following major frameworks and libraries:

- **Express** - The web framework used for building the backend.
- **Mocha** - The testing framework used for running integration tests.
- **Chai** - The assertion library used to validate test outcomes.
- **Sinon** - Provides standalone test and mocks for JavaScript,.

## Unit Tests
Unit tests can be run with the following command, which targets tests designed to validate the functionality of individual units without external dependencies:

  ```bash
  npm run test

  ```
## Test Environment
Ensure that the test environment is properly configured:

Environment Variables: Configure necessary environment variables through a .env file or environment-specific settings.
  
