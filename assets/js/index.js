document.addEventListener('DOMContentLoaded', function () {
    let path = window.location.pathname;

    const link = document.getElementById('theme-style');
    const theme = localStorage.getItem('theme') || 'tema-claro.css';
    link.href = getCSSPath(theme);

    if (path.includes('hoje.html')) {
        exibirTarefasDeHoje();
    } else if (path.includes('concluido.html')) {
        exibirTarefasConcluidas();
    } else {
        carregarTarefas();
    }

    document.getElementById('adicionar-tarefa')?.addEventListener('click', function () {
        let titulo = document.getElementById('titulo').value.trim();
        let data = document.getElementById('data').value.trim();
        let descricao = document.getElementById('descricao').value.trim();

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
            limparCampos();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
});

function obterDataDeHoje() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${ano}-${mes}-${dia}`;
}

function adicionarTarefa(tarefa) {
    exibirTarefa(tarefa);
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function exibirTarefa(tarefa) {
    const novaTarefa = document.createElement('div');
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
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(exibirTarefa);
}

function exibirTarefasDeHoje() {
    const hoje = obterDataDeHoje();
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefasDeHoje = tarefas.filter(tarefa => tarefa.data === hoje);
    atualizarListaDeTarefas(tarefasDeHoje);
}

function exibirTarefasConcluidas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefasConcluidas = tarefas.filter(tarefa => tarefa.concluido);
    atualizarListaDeTarefas(tarefasConcluidas);
}

function marcarConcluida(checkbox, titulo) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(tarefa => {
        if (tarefa.titulo === titulo) {
            tarefa.concluido = checkbox.checked;
        }
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function toggleCSS() {
    const link = document.getElementById('theme-style');
    const currentStyle = link.getAttribute('href');
    const newStyle = currentStyle.endsWith('tema-claro.css') ? 'tema-escuro.css' : 'tema-claro.css';
    link.href = getCSSPath(newStyle);
    localStorage.setItem('theme', newStyle);
}

function getCSSPath(cssFile) {
    const currentPath = window.location.pathname;
    return currentPath.includes('/assets/html/') ? `../css/${cssFile}` : `assets/css/${cssFile}`;
}

function limparCampos() {
    document.getElementById('titulo').value = '';
    document.getElementById('data').value = '';
    document.getElementById('descricao').value = '';
}

function atualizarListaDeTarefas(tarefas) {
    const tarefasContainer = document.getElementById('tarefas');
    tarefasContainer.innerHTML = '';
    tarefas.forEach(exibirTarefa);
}
