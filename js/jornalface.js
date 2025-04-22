const enviarDados = async (email, password) => {
    const url = 'https://back-spider.vercel.app/login'; // Endpoint da API

    const dados = {
        "email": email,
        "senha": password
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
        if (resultado.success) { // Se a resposta da API for "true"
            alert("Login bem-sucedido! Redirecionando...");
            window.location.href = "../src/pages/screens/home.html"; // Redireciona para a tela de registro
        } else {
            alert("Erro ao fazer login. Verifique suas credenciais.");
        }
    } catch (erro) {
        console.error("Erro ao enviar dados:", erro);
        alert("Erro na conexão. Tente novamente.");
    }
};

// Captura o evento de submit no formulário
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        enviarDados(email, password); // Passa os valores corretamente
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});
