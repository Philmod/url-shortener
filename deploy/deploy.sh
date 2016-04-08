cd ~/url-shortener
git stash save
git pull
docker pull philmod/url-shortener
docker-compose -f docker-compose-staging.yml up -d
