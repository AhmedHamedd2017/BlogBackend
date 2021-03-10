const mailjet = require ('node-mailjet')
.connect('e0cae02a942b412558cadd66d7e4ab08', 'b4d414166e56bca8c04b9de4546422c3')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "ahmed159959@bue.edu.eg",
        "Name": "Ahmed"
      },
      "To": [
        {
          "Email": "ahmed159959@bue.edu.eg",
          "Name": "Ahmed"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "Hello world el mails"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
