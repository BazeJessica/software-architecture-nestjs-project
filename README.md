<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

A clean-architecture, DDD-based Medium-like API built with [NestJS](https://github.com/nestjs/nest).

### Features

- **Tags System**: Manage tags (Admin only), link them to posts, and filter posts by them.
- **Post Slugs**: Unique, SEO-friendly slugs generated from titles with manual override support.
- **Comments System**: Comment on accepted posts, with author notifications and recursive deletion rules.
- **Subscriptions & Notifications**: Follow/unfollow system with event-driven notifications for all major activities.
- **ABAC Security**: Attribute-Based Access Control enforcing fine-grained permissions across all modules.
- **Swagger Documentation**: Fully documented API with decorators and operation descriptions.

## Project Setup

```bash
# Install dependencies
$ npm install

# Configure environment
# Copy .env.example to .env and adjust variables
$ cp .env.example .env
```

## Database Seeding

Populate the database with initial users (admin, moderator, writer, reader), tags, and posts:

```bash
$ npm run seed
```

## Compile and Run

```bash
# development
$ npm run start

# watch mode (recommended for development)
$ npm run start:dev
```

## API Documentation

Once the app is running, visit:
`http://localhost:3000/api`

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
