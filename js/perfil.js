// Simulando dados da API
const apiData = {
  username: "Brunoh.diass",
  avatar: "https://i.imgur.com/WzrbEPR.jpg",
  story: "https://i.imgur.com/WzrbEPR.jpg",
  bio: "Bruno\n@corinthians",
  publicacoes: 2,
  seguidores: 777,
  seguindo: 777,
  posts: [
    "https://i.imgur.com/vjFvP2u.jpg",
    "https://i.imgur.com/2DiJrb5.png"
  ]
};

// Preenchendo os dados no HTML
document.getElementById("username").textContent = apiData.username;
document.getElementById("profile-pic").src = apiData.avatar;
document.getElementById("highlight-1").src = apiData.story;
document.getElementById("bio").innerText = apiData.bio;
document.getElementById("posts").textContent = apiData.publicacoes;
document.getElementById("followers").textContent = apiData.seguidores;
document.getElementById("following").textContent = apiData.seguindo;

const gallery = document.getElementById("gallery");
apiData.posts.forEach((url) => {
  const img = document.createElement("img");
  img.src = url;
  gallery.appendChild(img);
});
