
import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp, setPosts } from "../index.js";
import { addLike, deletePostFetch, disLike, getPosts, getUserPosts } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";


export function userPosts({ appEl }) {
  console.log("Актуальный список постов:", posts);


  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */



  const appHtml = posts.map((post, index) => {

    console.log("имя последнего лайкнувшего", post.likes[post.likes.length - 1]?.name)

    return `
      <li class="post">
        <div class="post-header" data-user-id=${post.userId}>
            <img src=${post.imageUrlAvatar} class="post-header__user-image">
            <p class="post-header__user-name">${post.name}</p>
        </div>
        <div class="post-image-container">
       
          <img class="post-image" src=${post.imageUrl}>
        </div>
    <div class="container-for-elements">
        <div class="post-likes">

        <button data-id=${post.id} data-index=${index} class="like-button">
        
        <img src= ${post.isLiked ? `./assets/images/like-active.svg>` : `./assets/images/like-not-active.svg>`}
        </button>

        <p class="post-likes-text">
          Нравится: <strong> ${post.likes.length > 1 ? `${post.likes[post.likes.length - 1]?.name} и еще ${post.likes.length - 1}`
        : post.likes.length === 0 ? "никто не лайкнул" :
          post.likes[0].name}</strong> 
          </p>
        
      </div>
      <div class="delete-element">
      <button class="delete-btn"  data-id=${post.id}> Удалить </button>
      </div>
  </div>
        <p class="post-text">
          <span class="user-name">${post.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
        ${formatDistanceToNow(post.created, new Date(),{
          locale: ru,
        })}
        </p>
   
      </li>`}).join("")


  appEl.innerHTML = `<div class="page-container">
  <div class="header-container"></div>

  <ul class="posts">${appHtml}</ul> 
  </div>`;



  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });

    });
  }


  function makeLike() {


    const likesButton = document.querySelectorAll(".like-button");

    for (const likeButton of likesButton) {

      likeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!getToken()) {
          alert("Нужно авторизоваться")
          return
        }
        const id = likeButton.dataset.id;
        console.log("id поста:", id);
        const index = likeButton.dataset.index;
        console.log("индекс чела:", index);


        if (posts[index].isLiked === true) {
          return disLike({ token: getToken(), id })
            .then(() => {
              getPosts({ token: getToken() })
                .then((response) => {
                  setPosts(response)
                  renderApp();
                })
            })
        }
        else {

          return addLike({ token: getToken(), id })
            .then(() => {
              getPosts({ token: getToken() })
                .then((response) => {
                  setPosts(response)
                  renderApp();
                })

            })
        }

      })

    }

  }
  makeLike()


//   const deleteItems = document.querySelectorAll('.delete-btn')
//   for (const deleteItem of deleteItems) {
//     deleteItem.addEventListener("click", () => {
//       if (!getToken()) {
//         alert("Нужно авторизоваться")
//         return
//       }
//       const id = deleteItem.dataset.id;
//       console.log(id)
//       deletePostFetch({ token: getToken(), id })
//         .then(() => {
//           alert("Удалил пост"),
//             goToPage(POSTS_PAGE)

//         })

//     })
//   }





}