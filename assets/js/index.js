document.addEventListener('DOMContentLoaded', function() {
    let path = window.location.pathname;
    
    if (path.includes('hoje.html')) {
        exibirTarefasDeHoje();
    } else if (path.includes('concluido.html')) {
        exibirTarefasConcluidas();
    } else {
        carregarTarefas();
    }
});

function obterDataDeHoje() {
    let hoje = new Date();
    let dia = hoje.getDate().toString().padStart(2, '0');
    let mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    let ano = hoje.getFullYear();
    
    return `${ano}-${mes}-${dia}`;
}

document.getElementById('adicionar-tarefa')?.addEventListener('click', function() {
    let titulo = document.getElementById('titulo').value;
    let data = document.getElementById('data').value;
    let descricao = document.getElementById('descricao').value;

    if (titulo && descricao) {
        if (!data) {
            data = obterDataDeHoje();
        }

        let novaTarefa = {
            titulo: titulo,
            data: data,
            descricao: descricao,
            concluido: false
        };

        adicionarTarefa(novaTarefa);

        document.getElementById('titulo').value = '';
        document.getElementById('data').value = '';
        document.getElementById('descricao').value = '';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

function adicionarTarefa(tarefa) {
    exibirTarefa(tarefa);

    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function exibirTarefa(tarefa) {
    let novaTarefa = document.createElement('div');
    novaTarefa.classList.add('tarefa');

    novaTarefa.innerHTML = `
        <h3>${tarefa.titulo}</h3>
        <p>${tarefa.data}</p>
        <p>${tarefa.descricao}</p>
        <input type="checkbox" ${tarefa.concluido ? 'checked' : ''} onchange="marcarConcluida(this, '${tarefa.titulo}')">
    `;

    document.getElementById('tarefas').appendChild(novaTarefa);
}

function carregarTarefas() {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(tarefa => exibirTarefa(tarefa));
}

function exibirTarefasDeHoje() {
    let hoje = obterDataDeHoje();
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    let tarefasDeHoje = tarefas.filter(tarefa => tarefa.data === hoje);

    document.getElementById('tarefas').innerHTML = '';
    tarefasDeHoje.forEach(tarefa => exibirTarefa(tarefa));
}

function exibirTarefasConcluidas() {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    let tarefasConcluidas = tarefas.filter(tarefa => tarefa.concluido);

    document.getElementById('tarefas').innerHTML = '';
    tarefasConcluidas.forEach(tarefa => exibirTarefa(tarefa));
}

function marcarConcluida(checkbox, titulo) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(tarefa => {
        if (tarefa.titulo === titulo) {
            tarefa.concluido = checkbox.checked;
        }
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}
