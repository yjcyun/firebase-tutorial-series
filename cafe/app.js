const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// create element and render cafe
function renderCafe(doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let city = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = 'x';

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // DELETE DATA  
  cross.addEventListener('click', e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('cafes').doc(id).delete();
  })
}

// // GETTING DATA
// // db.collection('collectionname').get() => async function
// // .where('city', '==', 'Chesterland')=> query data
// // .orderBy('name')
// // .where('city', '==', 'Marsland').orderBy('name')
// db.collection('cafes').get().then((snapshot) => {
//   // snapshot represents different data inside the collection
//   //console.log(snapshot.docs); returns an array
//   snapshot.docs.forEach(doc => {
//     //console.log(doc.data());
//     renderCafe(doc);
//   });
// })

// SAVING DATA
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // .add takes an object...
  db.collection('cafes').add({
    name: form.name.value,
    city: form.city.value,
  });
  form.name.value = '';
  form.city.value = '';
})

// REAL-TIME LISTENER
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type === 'added') {
      renderCafe(change.doc);
    } else if (change.type==='removed') {
      let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
      cafeList.removeChild(li);
    }
  })
})

/*
To update data name
  - .update
db.collection('cafes').doc('k3iGHpVWjv474qYDIAga').update({
  name: 'Wario World',
  city: 'Toronto'
})

 - .set will override the entire document, not just the specified key
db.collection('cafes').doc('k3iGHpVWjv474qYDIAga').set({
  city: 'New York'
})
*/