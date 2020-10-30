// ADD ADMIN CLOUD FUNCTION
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

// LISTEN FOR AUTH STATUS CHANGES
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    });
    // GET DATA
    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
    }, err => {
      console.log(err.message);
    });

  } else {
    setupUI();
    setupGuides([]);
  }
});

// CREATE NEW GUIDE
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', e => {
  e.preventDefault();

  db.collection('guides').add({
    title: createForm['title'].value,
    content: createForm['content'].value
  }).then(() => {
    // close modal and reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// SIGNUP
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up user
  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });
});

// LOGOUT
const logout = document.querySelector('#logout');
logout.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut();
});

// LOGIN
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // sign in user
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close login modal and reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err=>{
    loginForm.querySelector('.error').innerHTML = err.message;
  });
});