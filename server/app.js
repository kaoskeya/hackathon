process.env.MAIL_URL = "smtp://cleanplace@lostinkaos.com:t1WBUWPDNK47tHL_u4ehEA@smtp.mandrillapp.com:587";

Accounts.emailTemplates.siteName = "CleanPlace";
Accounts.emailTemplates.from = "CleanPlace Admin <cleanplace@lostinkaos.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to a cleaner tomorrow, " + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return "You have been invited to participate in building a better future!"
     + " To activate your account, simply click the link below:\n\n"
     + url;
};