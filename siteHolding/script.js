    lucide.createIcons();

    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(item => {
      item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        const icon = item.querySelector('.icon');
        const isOpen = answer.classList.contains('open');

        // Fecha todos primeiro
        document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.remove('open'));
        document.querySelectorAll('.icon').forEach(ic => ic.classList.remove('rotate'));

        // Se o clicado não estava aberto, abre ele
        if (!isOpen) {
          answer.classList.add('open');
          icon.classList.add('rotate');
        }
      });
    });

    document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("meuForm");
      const inputs = form.querySelectorAll("input[required]");
      const btn = form.querySelector(".btn-consultar");

      // Máscara CPF/CNPJ
      function mascaraCpfCnpj(valor) {
        valor = valor.replace(/\D/g, "");
        if (valor.length <= 11) {
          return valor.replace(/(\d{3})(\d)/, "$1.$2")
                      .replace(/(\d{3})(\d)/, "$1.$2")
                      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else {
          return valor.replace(/^(\d{2})(\d)/, "$1.$2")
                      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                      .replace(/\.(\d{3})(\d)/, ".$1/$2")
                      .replace(/(\d{4})(\d)/, "$1-$2");
        }
      }

      // Máscara celular
      function mascaraCelular(valor) {
        valor = valor.replace(/\D/g, "");
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      }

      // Validação
      function validarCampo(input) {
        const errorMsg = input.nextElementSibling;
        let valido = true;

        if (!input.value.trim()) {
          errorMsg.textContent = "Campo obrigatório!";
          valido = false;
        } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
          errorMsg.textContent = "Digite um e-mail válido!";
          valido = false;
        } else if (input.id === "celular" && input.value.replace(/\D/g, "").length !== 11) {
          errorMsg.textContent = "Digite um celular válido!";
          valido = false;
        } else if (input.id === "cpfCnpj") {
          const digits = input.value.replace(/\D/g, "");
          if (!(digits.length === 11 || digits.length === 14)) {
            errorMsg.textContent = "Digite um CPF ou CNPJ válido!";
            valido = false;
          }
        }

        if (!valido) {
          input.classList.add("error");
          errorMsg.style.display = "block";
        } else {
          input.classList.remove("error");
          errorMsg.style.display = "none";
        }

        return valido;
      }

      // Máscaras em tempo real
      document.getElementById("cpfCnpj").addEventListener("input", (e) => {
        e.target.value = mascaraCpfCnpj(e.target.value);
        validarCampo(e.target);
      });

      document.getElementById("celular").addEventListener("input", (e) => {
        e.target.value = mascaraCelular(e.target.value);
        validarCampo(e.target);
      });

      // Validação em tempo real
      inputs.forEach(input => {
        input.addEventListener("input", () => {
          validarCampo(input);
          btn.disabled = ![...inputs].every(campo => validarCampo(campo));
          btn.style.cursor = btn.disabled ? "not-allowed" : "pointer";
          btn.style.background = btn.disabled ? "#ccc" : "#0A2326";
          btn.style.color = btn.disabled ? "#666" : "#fff";
        });
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        let valido = true;

        inputs.forEach(input => {
          if (!validarCampo(input)) valido = false;
        });

        if (valido) {
          const data = {
            nome: form.nome.value,
            cpfCnpj: form.cpfCnpj.value,
            email: form.email.value,
            celular: form.celular.value,
            processo: form.processo.value
          };
    
          try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbz42M6bgQepkbRjG9kxG85n7buZoJq0vc0iAbHy2xq3zym5ueu9c-YMSZ_PmdMF9zaZ/exec", {
              method: "POST",
              mode: "no-cors", // evita erro de CORS
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            });
    
            alert("Dados enviados com sucesso!");
            form.reset();
            btn.disabled = true;
            btn.style.background = "#ccc";
            btn.style.color = "#666";
            btn.style.cursor = "not-allowed";
    
          } catch (error) {
            alert("Erro ao enviar os dados. Tente novamente.");
            console.error(error);
          }
        }
      });
    });