# TI Mobile Nodejs Backend


## Install software

- node 8.2.0 (v6+ also work)
- npm 5.x
- mysql 5.7
- a mock SMTP server, e.g. fakeSMTP (http://nilhcem.com/FakeSMTP/)



## Configuration

Config is provided at config/default.js and production.js.


| key                           | system Environment name       | description                              |
| ----------------------------- | ----------------------------- | ---------------------------------------- |
| LOG_LEVEL                     | LOG_LEVEL                     | the log level                            |
| PORT                          | PORT                          | the server port                          |
| PASSWORD_HASH_SALT_LENGTH     | PASSWORD_HASH_SALT_LENGTH     | the password hash salt length            |
| ACCESS_TOKEN_EXPIRES          | ACCESS_TOKEN_EXPIRES          | the access token expiration in seconds   |
| VERIFY_TOKEN_EXPIRES          | VERIFY_TOKEN_EXPIRES          | the verify email token expiration in seconds |
| FORGOT_PASSWORD_TOKEN_EXPIRES | FORGOT_PASSWORD_TOKEN_EXPIRES | the forgot password token expiration in seconds |
| QUERY_DEFAULT_LIMIT           | QUERY_DEFAULT_LIMIT           | the default query limit                  |
| API_VERSION                   | API_VERSION                   | the API version                          |
| VERIFY_EMAIL_SUBJECT          | VERIFY_EMAIL_SUBJECT          | the verify email subject                 |
| VERIFY_EMAIL_CONTENT          | VERIFY_EMAIL_CONTENT          | the verify email content                 |
| FORGOT_PASSWORD_EMAIL_SUBJECT | FORGOT_PASSWORD_EMAIL_SUBJECT | the forgot password email subject        |
| FORGOT_PASSWORD_EMAIL_CONTENT | FORGOT_PASSWORD_EMAIL_CONTENT | the forgot password email content        |
| FROM_EMAIL                    | FROM_EMAIL                    | the from email used to send email        |
| email                         |                               | the email config used for nodermail      |
| email.host                    | SMTP_HOST                     | the SMTP host                            |
| email.port                    | SMTP_PORT                     | the SMTP port                            |
| email.auth.user               | SMTP_USER                     | the SMTP user name                       |
| email.auth.pass               | SMTP_PASSWORD                 | the SMTP password                        |
| db                            |                               | the MySQL db connection object           |
| db.uri                        | MYSQL_URI                     | the mysql connect uri , for example "mysql://root:123456@localhost:3306/ti" |
| db.options                    |                               | the mysql connection options             |



## SMTP server setup

We may use a mock SMTP server to simplify tests. And fakeSMTP (http://nilhcem.com/FakeSMTP/) can be used.
Download the `fakeSMTP-2.0.jar` from the website, then run `java -jar fakeSMTP-2.0.jar -m` to start mock SMTP server.
When the GUI is shown, cilck the `Start Server` to start the mock SMTP server.

Note that when you view the email content in fakeSMTP, it is raw email content, which is encoded using quoted-printable
encoding. It is a little different than that is really displayed. At the end of some lines, you may see '=' character,
this '=' is used to link lines, it is not part of final decoded content.

For example, if you see some token like below:
```
99a12ba0-97a4-43dc-beb2-e4a9886b73=
b1-1511720563554
```

the actual token should be:
```
99a12ba0-97a4-43dc-beb2-e4a9886b73b1-1511720563554
```


Note that the fakeSMTP can accept any username/password.

You may also consider using other SMTP server.

##Heroku deployment

- heroku create
- git init
- git add *
- git commit -m "upload project"
- heroku addons:create jawsdb
- heroku config:set EMAIL_USER=youemail@gmail.com EMAIL_PASS=123456 SMTP_HOST=smtp.gmail.com SMTP_PORT=465
- git push heroku master

## Local deployment

- start MySQL server, create an emtpy database, update config/default.js db.uri to point to the database
- npm i - install dependencies
- npm run lint - run code lint check
- npm run testdata - it will clear all data and insert test data,
  it creates an admin ('admin@test.com' / 'password') and normal user ('user@test.com' / 'password')
- npm start - it will create tables if not present, but if tables are present, it won't change data



## Verification

- start mock SMTP, start MySQL db, start app as above
- local Postman collection and environment in the docs folder into Postman
- do login as admin or user via the `security api` / `login - admin` or `login - user`, after login, the access token will be automatically set
  to environment variable accessToken, and can be used by other API calls;
  please note that some APIs need user role, others need admin role, you may check the routes definitions about which roles are needed for different routes
- some API depends on other API's data;
  for example, puchase card API needs a card, so you will need to first create a card in Postman, then login as user (purchase API
  needs user role), then purchase it; after purchse, you may get current user data to see that some pointsAmount is cut;
  you may also call the get user cards API to see user's cards
- you may create a track story, then use progress API to complete its progress, then use progress API to receive rewards,
  then get current user's cards and badges to verify that cards and badge are assigned to user
- flow to signup user:
  call the signup API;
  in the fakeSMTP, view the last email content, you can see token like below:
```
a0a13351-7192-4151-b4ed-168c25507a=
ba-1511721439823
```
  the ending '=' should be removed, and the two lines should be linked together, the token is:
```
a0a13351-7192-4151-b4ed-168c25507aba-1511721439823
```
  copy the token to verifyEmail API verificationToken parameter, and call the verifyEmail API

- flow to reset forgot password:
  call the initiateForgotPassword API;
  in the fakeSMTP, view the last email content, you can see token like below:
```
a8181534-05c2-4e51-9da2-27b46f95c98e-1511721790345
```
  copy the token to changeForgotPassword API body forgotPasswordToken parameter, and call the changeForgotPassword API

- other API tests should be intuitive



## Notes

- see discussion in forum, the app needs to support transaction, so RDBMS (MySQL) should be used instead of MongoDB, MongoDB doesn't support transation.
  Transaction is used when an operation involves multiple db updates.
  For example, when creating/updating TrackStory, multiple child entities are created/updated,
  it is hard to support atomic action if using MongoDB.
  There are other cases when transaction is needed, e.g. purchase card, persisting TrackStoryUserProgress, persisting Achievement,
  receive rewards etc.
  For sequelize transaction management, see:
  http://docs.sequelizejs.com/manual/tutorial/transactions.html#managed-transaction-auto-callback-
- please take TCUML in precedence over swagger file, the original swagger file has quite some flaws, it is now fixed to sync with the latest APIs;
  but still the TCUML entities/services are more accurate and more thorough, e.g. swagger API request/response may be just part of entities fields.
  I exported two major diagrams (the two PNG files) from TCUML for your reference.
- for the RacetrackService.search, the given SQL seems not right, I follow the below links to implement it:
  https://gis.stackexchange.com/questions/31628/find-points-within-a-distance-using-mysql
  https://stackoverflow.com/questions/1006654/fastest-way-to-find-distance-between-two-lat-long-points
- for the RacetrackService.search, raw SQL query is used, so it is important to avoid SQL injection attack,
  helper.sanitize is used to sanitize name filter parameter to avoid SQL injection attack
- for TrackStory, its child entities are also managed, when creating/updating TrackStory, if a child entity has no id, then the child entity is created,
  otherwise the child entity is updated;
  it is similar for TrackStoryUserProgress and Achievement, their child entities are also managed.



## Video

https://youtu.be/F1Wiv2c2niY

