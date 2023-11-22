

function buscarPersonagem() {
    const input = document.getElementById('searchInput').value;
    const isId = !isNaN(input);
    const url = isId ? `https://swapi.dev/api/people/${input}/` : `https://swapi.dev/api/people/?search=${input.toLowerCase()}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            const results = data.results;
            if (results.length > 0) {
                const promises = [
                    fetch(results[0].homeworld).then(response => response.json()),
                    Promise.all(results[0].films.map(film => fetch(film).then(response => response.json()))),
                    Promise.all(results[0].starships.map(starship => fetch(starship).then(response => response.json()))),
                    Promise.all(results[0].vehicles.map(vehicle => fetch(vehicle).then(response => response.json())))
                ];

                return Promise.all(promises).then(([homeworld, films, starships, vehicles]) => {
                    const personagem = new Personagem(
                        results[0].name,
                        results[0].height,
                        results[0].mass,
                        results[0].birth_year,
                        results[0].gender,
                        results[0].hair_color,
                        results[0].skin_color,
                        results[0].eye_color,
                        homeworld,
                        films,
                        starships,
                        vehicles
                    );
                    mostrarInformacoes(personagem);
                });
            } else {
                document.getElementById('characterInfo').innerHTML = '<p>Personagem não encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('characterInfo').innerHTML = '<p>Erro na requisição.</p>';
        });
}

function mostrarInformacoes(personagem) {
    const infoDiv = document.getElementById('characterInfo');
    infoDiv.innerHTML = '';

    const personagemContainer = document.createElement('div');
    personagemContainer.classList.add('personagem-container');

    const dadosPersonagemDiv = document.createElement('div');
    dadosPersonagemDiv.classList.add('dados-personagem');
    dadosPersonagemDiv.innerHTML = `<h2>${personagem.nome}</h2>
                                    <p>Altura: ${personagem.altura} cm</p>
                                    <p>Peso: ${personagem.peso} kg</p>
                                    <p>Ano de Nascimento: ${personagem.nascimento}</p>
                                    <p>Gênero: ${personagem.genero}</p>
                                    <p>Cor do Cabelo: ${personagem.corCabelo}</p>
                                    <p>Cor da Pele: ${personagem.corPele}</p>
                                    <p>Cor dos Olhos: ${personagem.corOlhos}</p>
                                    <p>Planeta Natal: ${personagem.homeworld.name}</p>`;

    const filmesDiv = document.createElement('div');
    filmesDiv.classList.add('filmes');
    filmesDiv.innerHTML = `<h2>Filmes</h2>
                           <p>${extrairNomes(personagem.films)}</p>`;

    const navesVeiculosDiv = document.createElement('div');
    navesVeiculosDiv.classList.add('naves-veiculos');
    navesVeiculosDiv.innerHTML = `<h2>Naves</h2>
                                 <p>${extrairNomes(personagem.starships)}</p>
                                 <h2>Veículos</h2>
                                 <p>${extrairNomes(personagem.vehicles)}</p>`;

    personagemContainer.appendChild(dadosPersonagemDiv);
    personagemContainer.appendChild(filmesDiv);
    personagemContainer.appendChild(navesVeiculosDiv);

    infoDiv.appendChild(personagemContainer);
}

function extrairNomes(lista) {
    return lista.map(item => item.title || item.name).join('<br>');
}

function resetarPagina() {
    location.reload();
}
