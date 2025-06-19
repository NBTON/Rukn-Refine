const { createClient } = require('@supabase/supabase-js');
const verificationCodes = require('../models/verificationCodes');
const smsService = require('../utils/smsService');

// u0625u0639u062fu0627u062f Supabase
const { supabaseUrl, supabaseKey } = require("../config");
const supabase = createClient(supabaseUrl, supabaseKey);

// u0627u0644u062au062du0642u0642 u0645u0646 u0631u0645u0632 u0627u0644u062au062du0642u0642 u0644u0631u0642u0645 u0627u0644u0647u0627u062au0641
exports.verifyPhoneCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'u0631u0645u0632 u0627u0644u062au062du0642u0642 u0645u0637u0644u0648u0628'
      });
    }

    // u0627u0644u062au062du0642u0642 u0645u0646 u0627u0644u0631u0645u0632
    const result = await verificationCodes.verifyCode(userId, code);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'u062au0645 u0627u0644u062au062du0642u0642 u0645u0646 u0631u0642u0645 u0627u0644u0647u0627u062au0641 u0628u0646u062cu0627u062d',
      verified: true
    });

  } catch (error) {
    console.error('Error verifying phone code:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u0627u0644u062au062du0642u0642 u0645u0646 u0631u0645u0632 u0627u0644u062au062du0642u0642'
    });
  }
};

// u0625u0639u0627u062fu0629 u0625u0631u0633u0627u0644 u0631u0645u0632 u0627u0644u062au062du0642u0642
exports.resendVerificationCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: userData } = await supabase.auth.admin.getUserById(userId);

    if (!userData || !userData.user || !userData.user.user_metadata || !userData.user.user_metadata.phone) {
      return res.status(400).json({
        success: false,
        message: 'u0644u0645 u064au062au0645 u0627u0644u0639u062bu0648u0631 u0639u0644u0649 u0631u0642u0645 u0627u0644u0647u0627u062au0641 u0627u0644u0645u0631u062au0628u0637 u0628u0627u0644u0645u0633u062au062eu062fu0645'
      });
    }

    const phone = userData.user.user_metadata.phone;
    
    // u0625u0646u0634u0627u0621 u0631u0645u0632 u062cu062fu064au062f u0648u0625u0631u0633u0627u0644u0647
    const verificationRecord = await verificationCodes.createOrUpdateVerificationCode(userId, phone);
    await smsService.sendVerificationSMS(phone, verificationRecord.code);

    res.status(200).json({
      success: true,
      message: 'u062au0645 u0625u0631u0633u0627u0644 u0631u0645u0632 u0627u0644u062au062du0642u0642 u0645u0631u0629 u0623u062eu0631u0649'
    });

  } catch (error) {
    console.error('Error resending verification code:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      // u0641u064a u0628u064au0626u0629 u0627u0644u062au0637u0648u064au0631u060c u0646u0637u0628u0639 u0627u0644u062eu0637u0623 u0627u0644u0643u0627u0645u0644 u0644u0644u062au0646u0642u064au062d
      res.status(500).json({
        success: false,
        message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u0625u0639u0627u062fu0629 u0625u0631u0633u0627u0644 u0631u0645u0632 u0627u0644u062au062du0642u0642',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u0625u0639u0627u062fu0629 u0625u0631u0633u0627u0644 u0631u0645u0632 u0627u0644u062au062du0642u0642'
      });
    }
  }
};

// u0627u0644u062au062du0642u0642 u0645u0646 u062du0627u0644u0629 u0627u0644u062au062du0642u0642 u0644u0644u0645u0633u062au062eu062fu0645
exports.checkVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // u0627u0644u062au062du0642u0642 u0645u0646 u062du0627u0644u0629 u0627u0644u062au062du0642u0642
    const status = await verificationCodes.getVerificationStatus(userId);

    res.status(200).json({
      success: true,
      verified: status.verified
    });

  } catch (error) {
    console.error('Error checking verification status:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u0627u0644u062au062du0642u0642 u0645u0646 u062du0627u0644u0629 u0627u0644u062au062du0642u0642'
    });
  }
};
