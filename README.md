# Bulk Email Processing System

This is backend framework of Bulk Email Processing System.

## Application Setup.

```bash
git clone --branch develop https://github.com/dipendrabhatt/bulk-email-processor-system-backend
copy .env example file. and setup all config.
setup rabbitmq and  update env file.
setup mailtrap and update env username password
yarn 
yarn template:seed
yarn start:dev
```

## Application Workflow

1. Sign up.
2. VerificationLink (email).
3. Login.
4. Choose template and upload excel , excel must have one column with  header email and then the list of emails.
5. Click on send button.
6. Check the status of email in the list.




