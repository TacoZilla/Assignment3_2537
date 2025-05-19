


function setup () {
  let firstCard = undefined
  let secondCard = undefined
  let lock = false
  let clicks = 0;
  let winpairs = 3;
  let totalpairs = 3;
  let pairsleft = 3;
  if (numpairs === 3) {
    winpairs = 3;
    totalpairs = 3;
    pairsleft = 3;
  } else if (numpairs === 6) {
    winpairs = 6;
    totalpairs = 6;
    pairsleft = 6;
  } else if (numpairs === 12) {
    winpairs = 12;
    totalpairs = 12;
    pairsleft = 12;
  }
  document.getElementById("totalpairs").textContent = totalpairs;
  document.getElementById("pairsleft").textContent = pairsleft;
  let matches = 0;
  $(".card").off("click").on(("click"), function () {
    if (lock || $(this).hasClass("flip")) {
      return;
    }
    clicks++;
    document.getElementById("clicks").textContent = clicks;
    $(this).toggleClass("flip");

    if (!firstCard)
      firstCard = this;
    else {
      secondCard = this;
      lock = true;

      const img1 = $(firstCard).find(".front_face")[0]
      const img2 = $(secondCard).find(".front_face")[0]

      console.log(firstCard, secondCard);
      if (
        img1.src == img2.src
      ) {
        matches++;
        pairsleft--;
        if (matches == winpairs) {
          alert("You win!");
          clearInterval(timer);
        }
        document.getElementById("matches").textContent = matches;
        document.getElementById("pairsleft").textContent = pairsleft;
        $(firstCard).off("click");
        $(secondCard).off("click");
        [firstCard, secondCard] = [undefined, undefined];
        lock = false;
      } else {
        console.log("no match")
        setTimeout(() => {
          $(firstCard).toggleClass("flip");
          $(secondCard).toggleClass("flip");
          [firstCard, secondCard] = [undefined, undefined];
          lock = false;
        }, 1000)
      }
    }
  });
}

$(document).ready(setup)




let pokemon = []; 

async function getPokemon() { 
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
  const data = await response.json();
  pokemon = data.results;
 
}

async function getPokemonImages(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.sprites.other["official-artwork"].front_default;

}

async function getPokemonShuffled(pairs) {
  let shuffled = pokemon.slice();

  shuffle(shuffled);
  let set = shuffled.slice(0, pairs);

  const cards = [];

  for (let mon of set) {

    let img = await getPokemonImages(mon.url);

    cards.push({ img, id: mon.name + "_first" });
    cards.push({ img, id: mon.name + "_second" });
  }

  shuffle(cards);
  return cards;
}

function shuffle(mons) {
  let index = mons.length;

  while (index != 0) {
    let temp = Math.floor(Math.random() * index);
    index--;

 
    [mons[index], mons[temp]] = [
      mons[temp], mons[index]];
  }
}

let seconds = 30;
let timer = null;

function startTime() {
  if (timer) {
    clearInterval(timer);
  }
  if (numpairs === 3) {
    seconds = 30;
  } else if (numpairs === 6) {
    seconds = 60;
  } else if (numpairs === 12) {
    seconds = 90;
  }
   timer = setInterval(() => {
    seconds--;
    document.getElementById("time").textContent = seconds;
    if (seconds <= 0) {
      clearInterval(timer);
      alert("Game Over");
    }
  }, 1000);
}

function renderCards(cards) {
  const grid = $("#game_grid");
  grid.empty();

  grid.removeClass("easy medium hard");
  if (numpairs === 3) {
    grid.addClass("easy");
  } else if (numpairs === 6) {
    grid.addClass("medium");
  } else if (numpairs === 12) {
    grid.addClass("hard");
  }
  const template = document.getElementById("template");
  for (let card of cards) {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector(".front_face");

    img.src = card.img;
    img.id = card.id;

    grid.append(clone);
  }
  setup(); 
}

let numpairs = 3;
document.querySelectorAll(".difficulty").forEach(btn => {
  btn.addEventListener("click", async () => {
    numpairs = parseInt(btn.value);
    if (pokemon.length === 0) {
    await getPokemon();
  }
  startTime();
  const cards = await getPokemonShuffled(numpairs); 
  cleanStats();
  renderCards(cards);
  });
});

document.getElementById("start_game").addEventListener("click", async () => {
  if (pokemon.length === 0) {
    await getPokemon();
  }
  startTime();
  const cards = await getPokemonShuffled(numpairs); 
  cleanStats();
  renderCards(cards);
});

document.getElementById("reset_game").addEventListener("click", async () => {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("flip");
    
  });
   const cards = await getPokemonShuffled(numpairs); 
   cleanStats();
    renderCards(cards);
});

function cleanStats() {
  clicks = 0;
  matches = 0;
  if (numpairs === 3) {
    seconds = 30;
  } else if (numpairs === 6) {
    seconds = 60;
  } else if (numpairs === 12) {
    seconds = 90;
  }
  document.getElementById("clicks").textContent = clicks;
  document.getElementById("matches").textContent = matches;
  document.getElementById("time").textContent = seconds;
}

  document.getElementById("theme").addEventListener("click", function () {
        document.body.classList.toggle("dark");
        });

  let power = false;
  document.getElementById("power-up").addEventListener("click", function () {
    if (power) { return}

        document.querySelectorAll(".card").forEach(card => {
          card.classList.add("flip");
        });
        setTimeout(() => {
          document.querySelectorAll(".card").forEach(card => {
            card.classList.remove("flip");
            power = true;
          });
        }, 1000);
  });
        


