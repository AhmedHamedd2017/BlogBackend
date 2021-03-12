const mailjet = require ('node-mailjet').connect(process.env.MAILJET_API2,process.env.MAILJET_KEY2)

module.exports = ((req,res,from, subject, text, html , to) => {
    request = mailjet.post('send').request({
        FromEmail: from,
        FromName: '@noreply',
        Subject: subject,
        'Text-part': text,
        'Html-part': html,
        Recipients: [{ Email: to }]
      })
    .then(() => {
        res.status(200).send(`Email sent to ${req.userData.email}!`)
    })
    .catch((error) =>{
        return res.status(500).json({
            message: error
        })
    })
});