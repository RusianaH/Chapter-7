const { HashPassword, ComparePassword } = require('../helper/hash.helper')
const { ResponseTemplate } = require('../helper/templete.helper')
const { PrismaClient } = require('@prisma/client')
const transport = require('../lib/nodemailer')

const prisma = new PrismaClient()
var jwt = require('jsonwebtoken')

async function Create(req, res) {

    const { name, email, password } = req.body

    const hashPass = await HashPassword(password)

    const payload = {
        name,
        email,
        password: hashPass,
        }
    }

    const emailUser = await prisma.user.findUnique({
        where: {email: payload.email},
    });

    if (emailUser) {
        let resp = ResponseTemplate(null, 'Email/username already exist', null, 404)
        res.json(resp)
        return

    try {
        
        await prisma.user.create({
            data: payload,
        });

    

        let resp = ResponseTemplate(userView, 'success', null, 200)
        res.json(resp);
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.json(resp)
        return

    }
}

async function Login(req, res) {

    try {
        const { email, password } = req.body

        const checkUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (checkUser === null) {
            let resp = ResponseTemplate(null, 'email is not found or incorrect', null, 400)
            res.json(resp)
            return
        }

        const checkPassword = await ComparePassword(password, checkUser.password)

        if (!checkPassword) {
            let resp = ResponseTemplate(null, 'password is not correct', null, 400)
            res.json(resp)
            return
        }

        const token = jwt.sign({
            email: checkUser.email,
            user_id: checkUser.id
        }, process.env.SECRET_KEY);

        let resp = ResponseTemplate(token, 'success', null, 200)
        res.json(resp)
        return

    } catch (error) {
        let resp = ResponseTemplate(null, 'internal server error', error, 500)
        res.json(resp)
        return
    }
}

async function ForgotPassword(req, res) {
    try {
      const { email } = req.body;
  
      const user = await prisma.user.findUnique({
        where: { email: email },
        });
  
  if (!user) {
        let resp = ResponseTemplate(null, 'User not found', null, 404);
        return res.json(resp);
      }
  
      const resetToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
  
      // Send email with the reset link
      const resetLink = `http://your-app-url/reset-password?token=${resetToken}`;
      
   
  await transporter.sendMail({    
        to: email,
        subject: 'Password Reset',
        html: `Click this <a href="${resetLink}">link</a> to reset your password.`,
      });
  
      let resp = ResponseTemplate(null, 'Reset link sent to your email', null, 200);
      
      
  return res.json(resp);
    } catch (error) {
      console.error(error);
      
    
  let resp = ResponseTemplate(null, 'Internal server error', error, 500);
      return res.json(resp);
    }
  }
  
  async function ResetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
  
      
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  
     
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
      });
  
      if (!user) {
        let resp = ResponseTemplate(null, 'Invalid or expired token', null, 400);
        return res.json(resp);
      }
  
      const hashPass = await HashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPass },
      });
  
      let resp = ResponseTemplate(null, 'Password reset successful', null, 200);
      return res.json(resp);
    } catch (error) {
      console.error(error);
      let resp = ResponseTemplate(null, 'Invalid or expired token', error, 400);
      return res.json(resp);
    }
  }
  


module.exports = {
    Create,
    Login,
    ForgotPassword,
    ResetPassword
}