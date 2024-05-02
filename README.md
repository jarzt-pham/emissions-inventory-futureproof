# Emissions Inventory Futureproof

An Application belongs Futureproof

## About

You work for a company that is committed to sustainability and reducing CO2 emissions. The company's goal is to develop an emission
inventory that will serve as a basis for businesses to measure, report, and reduce their emissions. Your task is to program the backend of
the emissions inventory

## Built With

- NestJS
- Mysql

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Prerequisites

#### Installing

1. Clone Repository

```bash
git clone https://github.com/jarzt-pham/emissions-inventory-futureproof.git
```

2. Install Mysql

   Install [here](https://dev.mysql.com/downloads/installer/)

   > If you have Docker, you can skip this step, in a [docker-compose.yaml](./docker-compose.yaml), I have written a mysql container.

---

#### Environment

Copy a script below and paste to your terminal

```bash
echo "
DATABASE_HOST=""
DATABASE_PORT=""
DATABASE_NAME="emission_inventory"
DATABASE_USER=""
DATABASE_PASSWORD=""
" > .env
```

You can get an example value [here](./.example.env)

---

### Build and Start

You have 2 ways to start this project

- With Docker:

  ```bash
  docker compose up
  ```

- Without Docker:
  ```
  npm install && npm run start:dev
  ```

### Usage

You can import and read all the apis in this project at [here](./documents/apis/readme.md)

### Additional

Read the estimation and business, workflow every task to do this project at [here](./documents/core/readme.md)

## Related Documents

- APIs Documentation: [link](./documents/apis/readme.md)
- Project Documentation: [link](./documents/core/readme.md)
- Database Diagram: [link](./documents/core/db-diagram.png)
