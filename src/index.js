const collection = document.getElementById('toy-collection')
const addToyForm = document.querySelector('.add-toy-form')
const newToy = document.getElementsByClassName('input-text')[0]
const newToyImg = document.getElementsByClassName('input-text')[1]

let addToy = false;

function addToyCard(name, imgSrc, likes, id){
  let toy = document.createElement('div')
  toy.classList.add('card')
  collection.append(toy)
  toy.innerHTML = 
  `<h2>${name}</h2> 
  <img src='${imgSrc}' class='toy-avatar' /> 
  <p>${likes} Likes</p>
  <button class='like-btn' id='${id}'>Like ❤️</button>`
  toy.querySelector('button').addEventListener('click', addLike)
}

function fetchToys(){
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(function(data){
    collection.innerHTML = ''
    data.forEach(function(element){
      addToyCard(element.name, element.image, element.likes, element.id)
    })
  })
}

const addLike = function(event){
  let newNumberOfLikes = Number(event.target.parentNode.querySelector('p').innerText.split(' ')[0]) + 1
  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: 'PATCH',
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({"likes": newNumberOfLikes})
  })
  .then(response => response.json())
  .then(function(data){
    let likeCount = document.getElementById(data.id).parentNode.querySelector('p')
    likeCount.innerText = newNumberOfLikes + ' ' + likeCount.innerText.split(' ')[1]
  })
}

const addNewToy = function(event){
  event.preventDefault()
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers:{
      'Content-Type': "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": `${newToy.value}`,
      "image": `${newToyImg.value}`,
      "likes": 0,
    })
  })
  .then((response) => response.json())
  .then(function(data){
    addToyCard(newToy.value, newToyImg.value, 0, data.id)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys()
  addToyForm.addEventListener('submit', addNewToy)
})
