echo 'Start the initialization..'

deployLocation=$1
vagrantConfLocation=$2
appEnvLocation=$3
sqlScriptLocation=$4

# Remove existing files
echo 'Remove existing files..'
rm -rf $deployLocation/*

# Copy the config file to the app location
cp $vagrantConfLocation $deployLocation/

# Copy the files to the app location
cp $(pwd)/* -R $deployLocation/
echo 'Copied files..'

# Copy the env files to the app location.
cp $appEnvLocation $deployLocation/.env
cp $appEnvLocation $deployLocation/.env.test

# Copy the schema creation script to the app location
cp $sqlScriptLocation "$deployLocation/createSchema.sh"

# Go to the app location and start the vagrant
cd $deployLocation && vagrant up
echo 'Vagrant is ready to use..'
