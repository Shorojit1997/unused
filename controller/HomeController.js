const CreateTable = require('../database/CreateTable')

const { signUpValidation } = require('../validation/signupValidation')
const bcrypt = require('bcrypt');
const query = require("../database/query");

const home = async (req, res, next) => {

  try {
    //   CreateTable();
    //  console.log(req.doctor);
    let VideoInfo=await query(`select VideoBioUrl from doctorInfo limit 20`);
    res.render('index', { title: "Welcome to Doctor's Point", user: { isLogin: false },VideoInfo });
  }
  catch (e) {

    console.log(e);

  }

}


const SignupGetController = async (req, res, next) => {

  try {
    console.log("Get Signup")

    res.render('signup', { title: "Signup here", user: { isLogin: req.session.isLogin } });
  }
  catch (e) {

    next();
  }
}
const LoginGetController = async (req, res, next) => {

  try {

    res.render('login', { title: "Login Here", user: { isLogin: req.session.isLogin }, error: {} });
  }
  catch (e) {

    next();
  }
}


const SignupPostController = async (req, res, next) => {

  try {
    const error = signUpValidation(req.body);
    const hashPassword = await bcrypt.hash(req.body.password, 9);

    // doctor section 
    if (req.body.user_type == 'doctor') {

      let username = await query(`select * from doctorInfo where username='${req.body.username}'`);
      if (username.length) {
        error.username = "Username is already exists";
        return;
      }
      let email = await query(`select * from doctorInfo where Email='${req.body.email}'`);
      if (email.length) {
        error.email = "Email is already exists";
        return;
      }

      await query(`insert into doctorinfo ( Username, Email,Password,Phone,CompleteProfile) values ('${req.body.username}','${req.body.email}','${hashPassword}','${req.body.phone}',25)`);
      let doctor = await query(`select * from doctorinfo where Username='${req.body.username}'`);
      req.session.isLogin = true;
      req.session.DoctorId = doctor[0].DoctorId;
      req.session.save((err) => {
        if (err)
          return next();
      })

      res.redirect('/')

    }

    else {
      // for patient section 

      let username = await query(`select * from  patients where Username='${req.body.username}'`);
      if (username.length) {
        error.username = "Username is already exists";
        return;
      }
      let email = await query(`select * from patients where Email='${req.body.email}'`);
      if (email.length) {
        error.email = "Email is already exists";
        return;
      }

      await query(`insert into Patients ( Username, Email,Password) values ('${req.body.username}','${req.body.email}','${hashPassword}')`);
      let patient = await query(`select * from Patients where Username='${req.body.username}'`);
      // req.session.doctor = doctor[0];
      req.session.isLogin = true;
      req.session.PatientId = patient[0].PatientId;

      req.session.save((err) => {
        if (err)
          return next();
      })
      res.redirect('/')
    }

    res.render('signup', { title: "Signup post here", user: { isLogin: req.session.isLogin } });
  }
  catch (e) {

    next();
  }
}
const LoginPostController = async (req, res, next) => {
  console.log('YesLogin')

  try {

    let username = req.body.username;
    let password = req.body.password;
    let error = {}

    if (!username) {
      error.username = "Please fill this form"
    }
    if (!password) {
      error.password = "Please fill this form"
    }
    if (!username || !password)
      return res.render('login',
        {
          title: "Login Here",
          user: { isLogin: req.session.isLogin },
          error: {
            username: error.username,
            password: error.password,
          }
        });

    let user = await query(`select * from doctorinfo where username='${username}'`);
    if (!user.length) {
      let user1 = await query(`select * from patients where username='${username}'`);
      if (user1.length)
        user = user1;
    }
    if (!user.length) {
      error.username = "Your username does not exist!";

      return res.render('login',
        {
          title: "Login Here",
          user: { isLogin: req.session.isLogin },
          error: {
            username: error.username,
            password: '',
            userName: username
          }
        });
    }

    let isUser = await bcrypt.compare(password, user[0].Password);
    if (isUser) {
      req.session.isLogin = true;
      if (user[0].DoctorId)
        req.session.DoctorId = user[0].DoctorId;
      else
        req.session.PatientId = user[0].PatientId;

     
      req.session.save((err) => {
        if (err)
          return next();
      })
      return res.redirect('/')
    }
    else {
      error.password = "Your password does not match!";

      return res.render('login',
        {
          title: "Login Here",
          user: { isLogin: req.session.isLogin },
          error: {
            username: '',
            password: error.password,
          }
        });
    }


    // res.render('login', { title: "Login Here", user: { isLogin: req.session.isLogin }, error: {} });
  }
  catch (e) {

    next();
  }
}

const LogoutController = async (req, res, next) => {

  try {
    await req.session.destroy();
    res.redirect('/');
  }
  catch (e) {

    next();
  }
}





module.exports = { home, SignupGetController, LoginGetController, SignupPostController, LoginPostController, LogoutController }