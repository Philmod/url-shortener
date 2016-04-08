git checkout master
git pull
npm version patch
git push --tags
git push
docker build -t philmod/url-shortener .
docker push philmod/url-shortener
ssh -i ./deploy/April2016.pem ubuntu@staging.url.canary.is './url-shortener/deploy/deploy.sh'
