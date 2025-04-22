document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('password').value;
        const senhaRecuperacao = document.getElementById('recoveryPassword').value;

        const nomeCompleto = `${firstName} ${lastName}`;

        if (!firstName || !lastName || !email || !senha || !senhaRecuperacao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        const btn = form.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Cadastrando...';

        try {
            const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: nomeCompleto,
                    email: email,
                    senha: senha,
                    premium: "0",
                    imagemPerfil: "https://example.com/default-profile.jpg",
                    senhaRecuperacao: senhaRecuperacao
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Erro ${response.status}`);
            }

            alert('Cadastro realizado com sucesso! Redirecionando...');
            // REDIRECIONAMENTO IGUAL AO LOGIN (../src/pages/screens/home.html)
            window.location.href = "../index.html"; 
        } catch (error) {
            console.error('Erro no cadastro:', error);

            let errorMessage = 'Erro ao cadastrar: ';
            if (error.message.includes('400')) {
                errorMessage += 'Dados inválidos enviados ao servidor. Verifique os campos.';
            } else {
                errorMessage += error.message || 'Erro desconhecido. Tente novamente.';
            }

            alert(errorMessage);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Cadastrar';
        }
    });
});