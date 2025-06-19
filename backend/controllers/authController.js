const { createClient } = require('@supabase/supabase-js');
const verificationCodes = require('../models/verificationCodes');
const smsService = require('../utils/smsService');

// u0625u0639u062fu0627u062f Supabase
const { supabaseUrl, supabaseKey } = require("../config");
const supabase = createClient(supabaseUrl, supabaseKey);

// u062au0633u062cu064au0644 u0645u0633u062au062eu062fu0645 u062cu062fu064au062f
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // u0627u0644u062au062du0642u0642 u0645u0646 u0648u062cu0648u062f u0627u0644u0628u064au0627u0646u0627u062a u0627u0644u0645u0637u0644u0648u0628u0629
    if (!email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'u0627u0644u0628u0631u064au062f u0627u0644u0625u0644u0643u062au0631u0648u0646u064a u0648u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631 u0648u0631u0642u0645 u0627u0644u0647u0627u062au0641 u0645u0637u0644u0648u0628u0629'
      });
    }

    // u0627u0644u062au062du0642u0642 u0645u0646 u0635u062du0629 u0631u0642u0645 u0627u0644u0647u0627u062au0641
    if (!smsService.validatePhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'u0631u0642u0645 u0627u0644u0647u0627u062au0641 u063au064au0631 u0635u062du064au062d. u064au062cu0628 u0623u0646 u064au0643u0648u0646 u0631u0642u0645 u0647u0627u062au0641 u0633u0639u0648u062fu064a u0635u062du064au062d'
      });
    }

    // u062au0646u0633u064au0642 u0631u0642u0645 u0627u0644u0647u0627u062au0641 u0625u0644u0649 u0627u0644u0635u064au063au0629 u0627u0644u062fu0648u0644u064au0629
    const formattedPhone = smsService.formatPhoneNumber(phone);

    // u0625u0646u0634u0627u0621 u0627u0644u0645u0633u062au062eu062fu0645 u0628u0627u0633u062au062eu062fu0627u0645 Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: formattedPhone,
          phone_verified: false // u0627u0644u0647u0627u062au0641 u063au064au0631 u0645u062au062du0642u0642 u0645u0646u0647 u0628u0634u0643u0644 u0627u0641u062au0631u0627u0636u064a
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // u0625u0646u0634u0627u0621 u0631u0645u0632 u062au062du0642u0642 u0648u0625u0631u0633u0627u0644u0647 u0644u0644u0645u0633u062au062eu062fu0645
    try {
      const verificationRecord = await verificationCodes.createOrUpdateVerificationCode(data.user.id, formattedPhone);
      await smsService.sendVerificationSMS(formattedPhone, verificationRecord.code);
    } catch (smsError) {
      console.error('Error sending verification code:', smsError);
      // u0645u0639 u0630u0644u0643u060c u0646u0643u0645u0644 u0639u0645u0644u064au0629 u0627u0644u062au0633u062cu064au0644 u0648u0644u0643u0646 u0646u0639u0644u0645 u0627u0644u0645u0633u062au062eu062fu0645 u0628u0623u0646 u0647u0646u0627u0643 u0645u0634u0643u0644u0629 u0641u064a u0625u0631u0633u0627u0644 u0627u0644u0631u0645u0632
    }

    // u0625u0630u0627 u0643u0627u0646 u0627u0644u062au0633u062cu064au0644 u0646u0627u062cu062du0627u064b
    res.status(201).json({
      success: true,
      message: 'u062au0645 u0625u0646u0634u0627u0621 u0627u0644u062du0633u0627u0628 u0628u0646u062cu0627u062d. u064au0631u062cu0649 u0627u0644u062au062du0642u0642 u0645u0646 u0631u0645u0632 u0627u0644u062au062du0642u0642 u0627u0644u0645u0631u0633u0644 u0625u0644u0649 u0631u0642u0645 u0647u0627u062au0641u0643',
      user: data.user,
      verification_required: true
    });

  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u0627u0644u062au0633u062cu064au0644'
    });
  }
};

// u062au0633u062cu064au0644 u0627u0644u062fu062eu0648u0644
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // u0627u0644u062au062du0642u0642 u0645u0646 u0648u062cu0648u062f u0627u0644u0628u064au0627u0646u0627u062a u0627u0644u0645u0637u0644u0648u0628u0629
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'u0627u0644u0628u0631u064au062f u0627u0644u0625u0644u0643u062au0631u0648u0646u064a u0648u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631 u0645u0637u0644u0648u0628u0629'
      });
    }

    // u062au0633u062cu064au0644 u0627u0644u062fu062eu0648u0644 u0628u0627u0633u062au062eu062fu0627u0645 Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // u0627u0644u062au062du0642u0642 u0645u0646 u062du0627u0644u0629 u0627u0644u062au062du0642u0642 u0645u0646 u0631u0642u0645 u0627u0644u0647u0627u062au0641
    const { verified } = await verificationCodes.getVerificationStatus(data.user.id);
    
    // u0625u0630u0627 u0643u0627u0646 u062au0633u062cu064au0644 u0627u0644u062fu062eu0648u0644 u0646u0627u062cu062du0627u064b
    res.status(200).json({
      success: true,
      message: 'u062au0645 u062au0633u062cu064au0644 u0627u0644u062fu062eu0648u0644 u0628u0646u062cu0627u062d',
      user: data.user,
      session: data.session,
      verified: verified,
      verification_required: !verified
    });

  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u062au0633u062cu064au0644 u0627u0644u062fu062eu0648u0644'
    });
  }
};

// u062au0633u062cu064au0644 u0627u0644u062eu0631u0648u062c
exports.logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'u062au0645 u062au0633u062cu064au0644 u0627u0644u062eu0631u0648u062c u0628u0646u062cu0627u062d'
    });

  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u062au0633u062cu064au0644 u0627u0644u062eu0631u0648u062c'
    });
  }
};

// u0646u0633u064au0627u0646 u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'u0627u0644u0628u0631u064au062f u0627u0644u0625u0644u0643u062au0631u0648u0646u064a u0645u0637u0644u0648u0628'
      });
    }

    // u0625u0631u0633u0627u0644 u0631u0627u0628u0637 u0625u0639u0627u062fu0629 u062au0639u064au064au0646 u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'u062au0645 u0625u0631u0633u0627u0644 u0631u0627u0628u0637 u0625u0639u0627u062fu0629 u062au0639u064au064au0646 u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631 u0625u0644u0649 u0628u0631u064au062fu0643 u0627u0644u0625u0644u0643u062au0631u0648u0646u064a'
    });

  } catch (error) {
    console.error('Error during password reset request:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u0637u0644u0628 u0625u0639u0627u062fu0629 u062au0639u064au064au0646 u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631'
    });
  }
};

// u0625u0639u0627u062fu0629 u062au0639u064au064au0646 u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631
exports.resetPassword = async (req, res) => {
  try {
    const { new_password } = req.body;

    if (!new_password) {
      return res.status(400).json({
        success: false,
        message: 'u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631 u0627u0644u062cu062fu064au062fu0629 u0645u0637u0644u0648u0628u0629'
      });
    }

    // u0625u0639u0627u062fu0629 u062au0639u064au064au0646 u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631
    const { error } = await supabase.auth.updateUser({
      password: new_password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'u062au0645 u062au062du062fu064au062b u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631 u0628u0646u062cu0627u062d'
    });

  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u062au062du062fu064au062b u0643u0644u0645u0629 u0627u0644u0645u0631u0648u0631'
    });
  }
};

// u0627u0644u062du0635u0648u0644 u0639u0644u0649 u0645u0639u0644u0648u0645u0627u062a u0627u0644u0645u0633u062au062eu062fu0645 u0627u0644u062du0627u0644u064a
exports.getUser = async (req, res) => {
  try {
    // u0627u0644u062du0635u0648u0644 u0639u0644u0649 u062au0648u0643u0646 u0627u0644u0645u0635u0627u062fu0642u0629 u0645u0646 u0627u0644u0647u064au062fu0631
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'u062au0648u0643u0646 u0627u0644u0645u0635u0627u062fu0642u0629 u063au064au0631 u0645u0648u062cu0648u062f'
      });
    }

    // u0627u0644u062au062du0642u0642 u0645u0646 u0635u062du0629 u0627u0644u062au0648u0643u0646 u0648u0627u0644u062du0635u0648u0644 u0639u0644u0649 u0627u0644u0645u0633u062au062eu062fu0645
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    // u0625u0631u062cu0627u0639 u0628u064au0627u0646u0627u062a u0627u0644u0645u0633u062au062eu062fu0645
    res.status(200).json({
      success: true,
      user: data.user
    });

  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u062cu0644u0628 u0628u064au0627u0646u0627u062a u0627u0644u0645u0633u062au062eu062fu0645'
    });
  }
};
