echo 'Start build process..'
cd /vagrant

# Create database schema before setting up the environment.
echo 'Create a schema.'
sh createSchema.sh

# Setup the environment.
yarn install --production

# Update the caleido library.
yarn upgrade caleido-lib

# Create the build
yarn start build
