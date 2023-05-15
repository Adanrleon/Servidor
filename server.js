const express = require('express'),
  app = express(),
  port = process.env.PORT || 3005,
  dotenv = require('dotenv'),
  cors = require('cors'),
  formData = require('form-data'),
  Mailgun = require('mailgun.js');

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

app.post('/api/email', (req, res) => {
    const {nombre, email, subject,message} = req.body;
    const messageData = {
        from: `${nombre} <${email}>`,
        to: "airsencecafam@gmail.com",
        subject: `${subject}`,
        text: `${message}`
      };    

      client.messages.create(process.env.MAILGUN_DOMAIN, messageData)
      .then((e) => {
        res.send({message: 'Email sent succesfully!'})
        console.log(e.message)
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
            message: 'something went wrong in sending email!'
        })
      });

})

app.use('/', (req, res) => {
    res.send('Mailgun API')
})

app.listen(port, () => {
    console.log(`running on http://localhost:${port}`)
})