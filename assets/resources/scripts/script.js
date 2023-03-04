'use strict';

$('#btn-next').on('click', () => {
  $('#form-one').hide();
  $('#form-two').show();
});

$('#btn-prev').on('click', () => {
  $('#form-two').hide();
  $('#form-one').show();
});
$(function () {
  $('#phone').mask('(99)99999-9999');
  $('#birthdate').mask('00/00/0000');
});
// validacao do cep

$(document).ready(function () {
  function limpa_formulário_cep() {
    $('#logradouro').val('');
    $('#complement').val('');
    $('#village').val('');
    $('#city').val('');
    $('#uf').val('');
    $('#code').val('');
  }

  $('#cep').blur(function () {
    var cep = $(this).val().replace(/\E/g, '');

    if (cep != '') {
      var validacaocep = /^[0-9]{8}$/;

      if (validacaocep.test(cep)) {
        $.getJSON(
          'https://viacep.com.br/ws/' + cep + '/json/?callback=?',
          function (dados) {
            if (!('erro' in dados)) {
              $('#logradouro').val(dados.logradouro);
              $('#complement').val(dados.complemento);
              $('#village').val(dados.bairro);
              $('#city').val(dados.localidade);
              $('#uf').val(dados.uf);
              $('#code').val(dados.ibge);
            }
          }
        );
      } else {
        //cep é inválido.
        limpa_formulário_cep();
        alert('Formato de CEP inválido.');
      }
    }
  });
});

$('#email').on('blur', function () {
  var email = $(this).val();
  var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

  if (!pattern.test(email)) {
    toastr.error('Email inválido');
    $(this).val('');
  }
});

function validatePassword() {
  if ($('#confirm-pass').val() != $('#pass').val()) {
    toastr.error('As senhas são diferentes');
    return false;
  } else {
    return true;
  }
}

$(document).ready(function () {
  $('#birthdate').on('blur', function () {
    let birthdate = $(this).val();
    let today = new Date();
    let birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    if (age < 16) {
      toastr.error(
        'Desculpe, você não tem idade suficiente para se cadastrar.'
      );
      $(this).val('');
    }
  });
});

$(document).ready(function () {
  $('#btn-manage-users').click(function () {
    $('#modal-manage-users').show();
  });

  $('#btn-close-modal').click(function () {
    $('#modal-manage-users').hide();
  });
});

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
let users = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('user-form').addEventListener('submit', (e) => {
  e.preventDefault();

  if (nameInput.value.trim() !== '' && emailInput.value.trim() !== '') {
    users.push({
      name: nameInput.value,
      email: emailInput.value,
    });

    localStorage.setItem('users', JSON.stringify(users));

    toastr.success('Usuário cadastrado com sucesso!');
    nameInput.value = '';
    emailInput.value = '';
  }
});

document.getElementById('view-Users').addEventListener('click', (e) => {
  e.preventDefault();
  renderUsers();
});

function renderUsers() {
  const userList = document.getElementById('user-list');

  userList.innerHTML = users
    .map(
      (user, index) => `
        <li><span>Nome: </span>${user.name} </br> <span>E-mail: </span>${user.email} 
        <button id="btn-edit-user" onclick="editUser(${index})">Editar Usuário</button></li>
        <button id="btn-save-edit" onclick="removeUser(${index})">Excluir Usuário</button>
      `
    )
    .join('');
}

let modalEditOpen = false;

function editUser(index) {
  if (modalEditOpen) {
    return;
  }
  modalEditOpen = true;

  const user = users[index];

  let modalEdit = document.getElementById('modalEdit');
  modalEdit.innerHTML = `
    <div id="edit-user-modal">
      <div>
        <label for="edit-name">Nome:</label>
        <input type="text" id="edit-name" value="${user.name}" />
      </div>

      <div>
        <label for="edit-email">E-mail:</label>
        <input type="email" id="edit-email" value="${user.email}" />
      </div>
      
      <button id="edit-user-button">Salvar</button>
    </div>
  `;

  $('#modalEdit').on('click', '#edit-user-button', function (e) {
    const editedName = document.getElementById('edit-name').value;
    const editedEmail = document.getElementById('edit-email').value;

    if (editedName.trim() !== '' && editedEmail.trim() !== '') {
      users[index] = { name: editedName, email: editedEmail };
      localStorage.setItem('users', JSON.stringify(users));
      renderUsers();
      modalEdit.innerHTML = '';
      modalEditOpen = false;
      toastr.success('Usuário editado com sucesso!');
    }
  });
}

function removeUser(index) {
  if (confirm('Deseja realmente excluir este usuário?')) {
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    toastr.success('Usuário excluído com sucesso!');

    if (modalEditOpen) {
      modalEditOpen = false;
      const modalEdit = document.getElementById('edit-user-modal');
      modalEdit.remove();
    }
  }
}
