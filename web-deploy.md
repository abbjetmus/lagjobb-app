npm run build
tar -cvf ./deploy.tar --exclude='\*.map' ./captain-definition ./dist/spa
caprover deploy -t ./deploy.tar
