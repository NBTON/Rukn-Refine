const { createClient } = require('@supabase/supabase-js');

// u0625u0639u062fu0627u062f Supabase
const { supabaseUrl, supabaseKey } = require("../config");
const supabase = createClient(supabaseUrl, supabaseKey);

// u062fu0627u0644u0629 u0644u0625u0646u0634u0627u0621 u0631u0645u0632 u062au062du0642u0642 u0639u0634u0648u0627u0626u064a
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // u0631u0645u0632 u0645u0643u0648u0646 u0645u0646 6 u0623u0631u0642u0627u0645
};

// u0625u0636u0627u0641u0629 u0631u0645u0632 u062au062du0642u0642 u062cu062fu064au062f u0623u0648 u062au062du062fu064au062b u0631u0645u0632 u0645u0648u062cu0648u062f
exports.createOrUpdateVerificationCode = async (userId, phone) => {
  try {
    // u0627u0644u062au062du0642u0642 u0645u0646 u0648u062cu0648u062f u0631u0645u0632 u0644u0646u0641u0633 u0627u0644u0645u0633u062au062eu062fu0645
    const { data: existingCodes } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId);

    const verificationCode = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // u0627u0644u0631u0645u0632 u0635u0627u0644u062d u0644u0645u062fu0629 15 u062fu0642u064au0642u0629

    if (existingCodes && existingCodes.length > 0) {
      // u062au062du062fu064au062b u0627u0644u0631u0645u0632 u0627u0644u0645u0648u062cu0648u062f
      const { data, error } = await supabase
        .from('verification_codes')
        .update({
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          verified: false
        })
        .eq('user_id', userId)
        .select();

      if (error) throw error;
      return data[0];
    } else {
      // u0625u0646u0634u0627u0621 u0631u0645u0632 u062cu062fu064au062f
      const { data, error } = await supabase
        .from('verification_codes')
        .insert({
          user_id: userId,
          phone: phone,
          code: verificationCode,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          verified: false
        })
        .select();

      if (error) throw error;
      return data[0];
    }
  } catch (error) {
    console.error('Error creating verification code:', error);
    throw error;
  }
};

// u0627u0644u062au062du0642u0642 u0645u0646 u0635u062du0629 u0631u0645u0632 u0627u0644u062au062du0642u0642
exports.verifyCode = async (userId, code) => {
  try {
    const { data: codes, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    if (!codes || codes.length === 0) {
      return { valid: false, message: 'u0644u0645 u064au062au0645 u0627u0644u0639u062bu0648u0631 u0639u0644u0649 u0631u0645u0632 u062au062du0642u0642 u0644u0647u0630u0627 u0627u0644u0645u0633u062au062eu062fu0645' };
    }

    const verificationRecord = codes[0];

    // u0627u0644u062au062du0642u0642 u0645u0646 u0639u062fu062f u0627u0644u0645u062du0627u0648u0644u0627u062a
    if (verificationRecord.attempts >= 5) {
      return { valid: false, message: 'u062au0645 u062au062cu0627u0648u0632 u0627u0644u062du062f u0627u0644u0623u0642u0635u0649 u0644u0639u062fu062f u0627u0644u0645u062du0627u0648u0644u0627u062a' };
    }

    // u0627u0644u062au062du0642u0642 u0645u0646 u0635u0644u0627u062du064au0629 u0627u0644u0631u0645u0632
    if (new Date() > new Date(verificationRecord.expires_at)) {
      return { valid: false, message: 'u0627u0646u062au0647u062a u0635u0644u0627u062du064au0629 u0631u0645u0632 u0627u0644u062au062du0642u0642' };
    }

    // u0627u0644u062au062du0642u0642 u0645u0646 u0645u0637u0627u0628u0642u0629 u0627u0644u0631u0645u0632
    if (verificationRecord.code !== code) {
      // u0632u064au0627u062fu0629 u0639u062fu062f u0627u0644u0645u062du0627u0648u0644u0627u062a
      const { error: updateError } = await supabase
        .from('verification_codes')
        .update({ attempts: verificationRecord.attempts + 1 })
        .eq('id', verificationRecord.id);

      if (updateError) throw updateError;

      return { valid: false, message: 'u0631u0645u0632 u0627u0644u062au062du0642u0642 u063au064au0631 u0635u062du064au062d' };
    }

    // u062au062du062fu064au062b u062du0627u0644u0629 u0627u0644u062au062du0642u0642
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('id', verificationRecord.id);

    if (updateError) throw updateError;

    // u062au062du062fu064au062b u062du0627u0644u0629 u0627u0644u0645u0633u062au062eu062fu0645 u0625u0644u0649 u0645u062au062du0642u0642 u0645u0646u0647
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ phone_verified: true })
      .eq('id', userId);

    if (userUpdateError) throw userUpdateError;

    return { valid: true, message: 'u062au0645 u0627u0644u062au062du0642u0642 u0645u0646 u0631u0642u0645 u0627u0644u0647u0627u062au0641 u0628u0646u062cu0627u062d' };
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

// u0627u0644u062du0635u0648u0644 u0639u0644u0649 u062du0627u0644u0629 u0627u0644u062au062du0642u0642 u0644u0644u0645u0633u062au062eu062fu0645
exports.getVerificationStatus = async (userId) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('phone_verified')
      .eq('id', userId);

    if (error) throw error;

    if (!users || users.length === 0) {
      return { verified: false, message: 'u0644u0645 u064au062au0645 u0627u0644u0639u062bu0648u0631 u0639u0644u0649 u0627u0644u0645u0633u062au062eu062fu0645' };
    }

    return { verified: users[0].phone_verified || false };
  } catch (error) {
    console.error('Error checking verification status:', error);
    throw error;
  }
};
