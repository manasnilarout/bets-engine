echo 'Start pre-build process..'

deployLocation=$1

# Add SSH agent
if [ -z "$SSH_AUTH_SOCK" ] ; then
  eval `ssh-agent -s`
  ssh-add
  echo 'Added SSH agent. '
fi

# Call the build.sh file here
cd $deployLocation && vagrant ssh -c "sh /vagrant/ops/build.sh"
