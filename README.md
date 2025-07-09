
<div align="center">
    
###### Projeto-Interfocus administração de Clientes e suas Dívidas💵
# Vendinha

</div>


<details>

<summary align="center">🧾 Resumo do Projeto</summary>

Este projeto tem como objetivo informatizar o controle de contas de clientes (dívidas penduradas) de uma vendinha, substituindo o controle manual em papel por um sistema digital eficiente.
A aplicação foi desenvolvida com .NET (C#) no backend e ReactJS no frontend, utilizando um banco de dados relacional PostgreSQL para persistência de dados, com suporte ao NHibernate para o mapeamento objeto-relacional.

</details>

---


<details><summary align="center">📊 Prints</summary><div align="center">

###### Opções menu Lateral
![image](https://github.com/user-attachments/assets/181efd50-8672-4d65-b730-2840f25fd51b)
![image](https://github.com/user-attachments/assets/7b20a813-06e2-4fb9-97db-988e1a05dfb5)
![image](https://github.com/user-attachments/assets/b4bf0a37-a951-4ced-98ce-22aac9d66811)
![image](https://github.com/user-attachments/assets/a22b972b-5ab8-4bea-87bb-d03c3f5e0daf)

---

###### Tela Inicial
![image](https://github.com/user-attachments/assets/6d38f974-00e6-4b29-9d38-66131351ddd7)

---

###### Paginação | Pesquisa
![image](https://github.com/user-attachments/assets/fe63a4ea-81d2-4879-b697-245d922b0cb8)
![image](https://github.com/user-attachments/assets/fd19536c-318e-4491-b634-a017bd10aac0)

---

###### Cadastro | Edição 
![image](https://github.com/user-attachments/assets/22e0a234-9bc0-472c-8070-200774279f6e)
![image](https://github.com/user-attachments/assets/7e18ca5b-4051-48ba-b63e-1323b64b15aa)

###### Visualização | Armazenamento de imagem no cache
![image](https://github.com/user-attachments/assets/d0c94306-d5d6-498d-854c-c2584082acdc)
![image](https://github.com/user-attachments/assets/f651e391-876c-4679-9c2c-960cd51adf8a)

###### Exclusão de Cliente | Cadastro de divida por cliente
![image](https://github.com/user-attachments/assets/024b24b9-b25b-4415-a82a-abb4e3ad1e0b)

---

###### Pagina de Dividas

![image](https://github.com/user-attachments/assets/bb55d6f4-1c81-4f44-87fd-bed9b840f707)

###### Cadastrar | Visualizar | Editar | Excluir 
![image](https://github.com/user-attachments/assets/38bd8347-4be1-4518-9fe8-f4e8ff9b9c59)
![image](https://github.com/user-attachments/assets/7a604bcb-2481-4cb3-bc73-f04e7b9ebc9e)

###### Visualizar | PagarDividaRapida | Excluir
![image](https://github.com/user-attachments/assets/6db1ff47-290e-43b2-b0b9-5a8b4ba882e3)
![image](https://github.com/user-attachments/assets/213a9e71-6ab2-430a-a7e0-7f68f28d6aaf)

###### NotaFiscal 
![image](https://github.com/user-attachments/assets/94ab124c-19d2-4491-92fb-10b304895669)
![image](https://github.com/user-attachments/assets/f7e56c96-b513-4339-afee-3274d4cad246)

---

###### Pagina de Relatorios
![image](https://github.com/user-attachments/assets/29c4fd0f-fbcb-4028-883c-3b1ccc1eec3d)

</div>

</details>

---

<details>

<summary align="center">📚 Bibliotecas Utilizadas</summary>



</details>

---

<details>

<summary align="center">🗂️ Versões</summary>

Node -> v22.12.0
.Net sdk -> 9.0.301
Aplicação c# -> net8.0

Cpf Version="2.1.0" 
IronPdf" Version="2025.6.8"
Microsoft.AspNetCore.Http.Abstractions" Version="2.3.0" 
NHibernate" Version="5.5.2"
Npgsql" Version="9.0.3"
Microsoft.Extensions.Configuration.Json" Version="9.0.7"
Swashbuckle.AspNetCore" Version="6.6.2"

</details>

---


<details>

<summary align="center">📋 Features</summary>

 ### 📌 Funcionalidades Exigidas

  - [x] Ordenar os clientes do que mais deve para o que menos deve
  - [x] Exibir o campo idade, calculada com base na data de nascimento
  - [x] Carregar a lista em lotes de 10 em 10
  - [x] Deve haver um campo de busca por nome, onde ao digitar um texto, os clientes correspondentes são exibidos
  - [x] No final da listagem, exibir a soma total das dívidas dos clientes
  - [x] Deve ser possível marcar uma dívida como paga
  - [x] Deve aparecer a soma das dívidas de cada cliente
  - [x] A somatória das dívidas de um cliente não pode ultrapassar R$ 200,00


 ### 🔧 Funcionalidades Extras

  - [x] Upload de foto de clientes.
  - [x] Restringir o cadastro de clientes menores de 18 anos ou maiores de 90 anos.
  - [x] Não permitir o cadastro com o nome "Mateus Dias".
  - [x] O e-mail deve atender aos seguintes requisitos: 
    1- Não pode ser vazio
    2- Deve conter entre 4 e 50 caracteres
    3- Deve conter "@" e terminar com ".com" ou ".br"
  - [x] O CPF deve ser válido conforme o padrão nacional (Brasil).
  - [x] Ao pagar divida, é gerado uma nota fiscal.
  
 

</details>

---

<details>

<summary align="center">🧩 Funcionalidades Extras</summary>

  - [x] Criação de um serviço AWS AMAZON S3 para armazenamento de imagem e pdf
  - [x] Hooks de imagem em cache do navegador
  - [x] Nota Fiscal do pagamento em pdf
  - [x] Criação de Trigger | View
  - [ ] Deploy

</details>

---

<details>

<summary align="center">📅 To do list</summary>

###### Board de desenvolvimento https://github.com/users/LucasMatheus144/projects/2
[![image](https://github.com/user-attachments/assets/cb8e5d9e-3f68-467a-9d77-844b1bdff81b)](https://github.com/users/LucasMatheus144/projects/2)


###### Fluxograma https://lucid.app/lucidspark/cf85fa0e-272c-48dd-9827-3bb6267f2ece/edit?viewport_loc=-21%2C873%2C3043%2C1509%2C0_0&invitationId=inv_6c79d1fc-9bdf-43aa-a84a-868ff3dbc553
![image](https://github.com/user-attachments/assets/8eb2b325-5269-4ef1-980e-b405d2ed20fc)


</details>

---

<details>

<summary align="center">🛠️ Intruções de Execução</summary>



</details>

---

<div align="center">
    
###### Tecnologias utilizadas para a proposta de desenvolvimento a baixo!

![My Skills](https://skillicons.dev/icons?i=html,css,js,react,vite,cs,dotnet,postgres,aws)

</div>

