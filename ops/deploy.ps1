# Stop the process
pm2 stop -s $(PM2_APP_NAME)

# Remove the existing files in the target location
rm -R $(DEPLOY_LOCATION)* -Force -ErrorAction SilentlyContinue

# Copy the latest build to the target location
cp -R .\$(SOURCE_LOCATION)* $(DEPLOY_LOCATION)

# Remove the existing environment files
rm $(DEPLOY_LOCATION).env*

# Copy the required environment files
cp $(ENV_LOCATION) $(DEPLOY_LOCATION).env
cp $(ENV_LOCATION) $(DEPLOY_LOCATION).env.test

# Change to the deployment location
cd $(DEPLOY_LOCATION)

# Installing node modules
yarn install --production

# Start the process
pm2 start $(PM2_CONFIG_LOCATION)
