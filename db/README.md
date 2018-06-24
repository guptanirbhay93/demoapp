### Setting up a db

# Starting a postgres db

chmod 700 ./rundb.sh
./rundb.sh

# Stopping a postgres db

chmod 700 ./stopdb.sh
./stopdb.sh

# Clearing a db if you have already set-it-up before

psql -d demodb -U demopostgres -p demopostgres123 -a -f ./cleardb.sql

# Clearing a db if you have already set-it-up before

psql -d demodb -U demopostgres -p demopostgres123 -a -f ./postgres.sql
