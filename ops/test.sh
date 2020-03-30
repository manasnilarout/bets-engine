echo 'Start test process..'
cd /vagrant

# Perform linting tests
echo 'Check linting errors..'
nps lint

# Perform unit tests
echo 'Run unit tests..'
# yarn start test

# Perform e2e tests
echo 'Run e2e tests..'
# yarn start test.e2e
