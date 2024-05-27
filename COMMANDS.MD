# Utils commands

### Create a migration
> ```bash
>    npx sequelize-cli migration:generate --name migration-example
> ```

### Running migrations
> ```bash
>   npx sequelize-cli db:migrate
> ```

### Undo migrations
> ```bash
>   npx sequelize-cli db:migrate:undo:all
> ```

### Running All Seeds
> ```bash
>   npx sequelize-cli db:seed:all
> ```

### Running Specific Seed
> ```bash
>   npx sequelize-cli db:seed --seed <seed-file-name>
> ```