new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(2);
    },1000);
}).then(data => {
    console.log(data);
    return data*2;
}).then(data=>{
    console.log(data);
    return data*2;
}).then(data=>{
    console.log(data);
    return data*2;
})

//As the result is passed along the chain of handlers, we can see a sequence of alert calls: 2 → 4 → 8

/**
 * Returning promises
A handler, used in .then(handler) may create and return a promise.

In that case further handlers wait until it settles, and then get its result 
*/

//for instance
new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(1)
    },1000);
}).then(data=>{
    console.log(data);
    return new Promise((resolve, reject)=>{
        resolve(data*2);
    })
}).then((data)=>{
    console.log(data);
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(data*2)
        },1000)
    })
}).then((data)=>{
    console.log(data)
});


//real world example for using promise 
function loadJson(url) {
    return fetch(url)
      .then(response => response.json());
  }
  
  function loadGithubUser(name) {
    return loadJson(`https://api.github.com/users/${name}`);
  }
  
  function showImage(githubUser) {
    return new Promise(function(resolve, reject) {
      let img = document.createElement('img');
      img.src = githubUser.avatar_url;
      img.className = "promise-avatar-example";
      document.body.append(img);
  
      setTimeout(() => {
        img.remove();
        resolve(githubUser);
      }, 3000);
    });
  }
  
  loadJson('/article/promise-chaining/user.json')
    .then(user => loadGithubUser(user.name))
    .then(showImage)
    .then(githubUser => alert(`Finished showing ${githubUser.name}`));