const enviarRegistro = async (firstName, lastName, email, password) => {
    const url = 'https://back-spider.vercel.app/user/cadastrarUser'; // Endpoint da API de registro

    const dados = {
        "nome": `${firstName} ${lastName}`, // Junta o primeiro e o último nome
        "email": email,
        "senha": password,
        "premium": "1", 
        "imagemPerfil": "https://assets.propmark.com.br/uploads/2022/02/WhatsApp-Image-2022-02-18-at-08.52.06.jpeg"
    };

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error(`Erro: ${resposta.status}`);
        }

        const resultado = await resposta.json();

        if (resultado.success) {
            alert("Registro bem-sucedido! Redirecionando...");
            window.location.href = "login.html"; // Redireciona para o login após o cadastro
        } else {
            alert("Erro ao registrar. Verifique os dados informados.");
        }
    } catch (erro) {
        console.error("Erro ao enviar dados:", erro);
        alert("Erro na conexão. Tente novamente.");
    }
};

// Captura o evento de submit no formulário
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (firstName && lastName && email && password) {
        enviarRegistro(firstName, lastName, email, password);
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});
