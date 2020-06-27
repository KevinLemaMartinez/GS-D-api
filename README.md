GSD-api
First you need to globally install the serverless framework
npm install serverless -g

Then you must initialice and download de node libraries running on the root folder of the project
npm install

The lambda postCard has his own node dependencies that require the initialization to on de folder /lambda/postCard
npm install

Download and install the AWS CLI https://docs.aws.amazon.com/cli/index.html and then run 
AWS configure
Fill you aws accout info

Last run: 
serverless deploy
