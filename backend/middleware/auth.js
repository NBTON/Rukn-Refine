const { createClient } = require('@supabase/supabase-js');

// u0625u0639u062fu0627u062f Supabase
const { supabaseUrl, supabaseKey } = require("../config");
const supabase = createClient(supabaseUrl, supabaseKey);

// u0627u0644u062au062du0642u0642 u0645u0646 u0627u0644u0645u0635u0627u062fu0642u0629
exports.checkAuth = async (req, res, next) => {
  try {
    // u0627u0644u062du0635u0648u0644 u0639u0644u0649 u062au0648u0643u0646 u0627u0644u0645u0635u0627u062fu0642u0629 u0645u0646 u0627u0644u0647u064au062fu0631
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'u063au064au0631 u0645u0635u0631u062d u0644u0643 u0628u0627u0644u0648u0635u0648u0644 - u062au0648u0643u0646 u063au064au0631 u0645u0648u062cu0648u062f'
      });
    }

    // u0627u0644u062au062du0642u0642 u0645u0646 u0635u062du0629 u0627u0644u062au0648u0643u0646 u0648u0627u0644u062du0635u0648u0644 u0639u0644u0649 u0627u0644u0645u0633u062au062eu062fu0645
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'u063au064au0631 u0645u0635u0631u062d u0644u0643 u0628u0627u0644u0648u0635u0648u0644 - u062cu0644u0633u0629 u063au064au0631 u0635u0627u0644u062du0629'
      });
    }

    // u062au062eu0632u064au0646 u0628u064au0627u0646u0627u062a u0627u0644u0645u0633u062au062eu062fu0645 u0641u064a u0627u0644u0637u0644u0628 u0644u0627u0633u062au062eu062fu0627u0645u0647u0627 u0641u064a u0646u0642u0627u0637 u0627u0644u0646u0647u0627u064au0629 u0627u0644u0645u062du0645u064au0629
    req.user = data.user;
    next();

  } catch (error) {
    console.error('Error in auth middleware:', error.message);
    res.status(500).json({
      success: false,
      message: 'u062du062fu062b u062eu0637u0623 u0623u062bu0646u0627u0621 u0627u0644u062au062du0642u0642 u0645u0646 u0627u0644u0645u0635u0627u062fu0642u0629'
    });
  }
};

// u0627u0644u062au062du0642u0642 u0645u0646 u0627u0644u062cu0644u0633u0629 (session check) u0644u0644u0637u0631u0642 u0627u0644u062au064a u0644u0627 u062au062au0637u0644u0628 u0645u0635u0627u062fu0642u0629 u0643u0627u0645u0644u0629
exports.checkSession = async (req, res, next) => {
  try {
    // u0627u0644u062du0635u0648u0644 u0639u0644u0649 u062au0648u0643u0646 u0627u0644u0645u0635u0627u062fu0642u0629 u0645u0646 u0627u0644u0647u064au062fu0631
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error) {
        req.user = data.user;
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in session check middleware:', error.message);
    next();
  }
};
