# Utils commands

### Pull MYSQL docker image
> ````bash
>   docker pull mysql
> ````

### Run mysql docker container
> `````bash
>   docker run --name fuber_mysql -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=fuberDev -e MYSQL_ROOT_HOST=% --restart unless-stopped mysql
> `````

### Stop docker database without loosing data
> ````bash
> docker stop fuber_mysql
> ````

### Start existing docker database
> ````bash
> docker start fuber_mysql
> ````

### Delete docker MYSQL container
> ````bash
>  docker remove fuber_mysql
> ````

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