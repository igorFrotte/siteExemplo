lucide.createIcons();

/* ===== FAQ (mantido) ===== */
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(item => {
  item.addEventListener('click', () => {
    const answer = item.nextElementSibling;
    const icon = item.querySelector('.icon');
    const isOpen = answer.classList.contains('open');

    document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.remove('open'));
    document.querySelectorAll('.icon').forEach(ic => ic.classList.remove('rotate'));

    if (!isOpen) {
      answer.classList.add('open');
      icon.classList.add('rotate');
    }
  });
});

/* ===== MODAIS (novo) ===== */
function openModal(modalId){
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(overlay){
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function bindOpenById(btnId, modalId){
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener("click", () => openModal(modalId));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openModal(modalId);
  });
}

bindOpenById("openSimulacao", "modalSimulacao");
bindOpenById("openParceria", "modalParceria");

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  // fecha ao clicar fora
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});

// fecha no X
document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const overlay = btn.closest(".modal-overlay");
    if (overlay) closeModal(overlay);
  });
});

// ESC fecha
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    document.querySelectorAll(".modal-overlay.open").forEach(ov => closeModal(ov));
  }
});

/* ===== Utilitários de máscara ===== */
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

function mascaraCelular(valor) {
  valor = valor.replace(/\D/g, "");
  // tenta formatar quando tiver 11 dígitos
  if (valor.length >= 11) {
    return valor.replace(/^(\d{2})(\d{5})(\d{4}).*$/, "($1) $2-$3");
  }
  return valor;
}

/* ===== Validação genérica ===== */
function validarCampo(input) {
  const errorMsg = input.nextElementSibling;
  let valido = true;

  if (!input.value.trim()) {
    errorMsg.textContent = "Campo obrigatório!";
    valido = false;
  } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
    errorMsg.textContent = "Digite um e-mail válido!";
    valido = false;
  } else if (input.dataset.kind === "celular") {
    const digits = input.value.replace(/\D/g, "");
    if (digits.length !== 11) {
      errorMsg.textContent = "Digite um celular válido!";
      valido = false;
    }
  } else if (input.dataset.kind === "cpfCnpj") {
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

function habilitarBotaoSeValido(form, btn){
  const inputs = form.querySelectorAll("input[required]");
  const allValid = [...inputs].every(i => validarCampo(i));
  btn.disabled = !allValid;
  btn.style.cursor = btn.disabled ? "not-allowed" : "pointer";
  btn.style.background = btn.disabled ? "#ccc" : "#0A2326";
  btn.style.color = btn.disabled ? "#666" : "#fff";
}

/* ===== SIMULAÇÃO (seu formulário original, agora dentro do modal) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("meuForm");
  if (form){
    const inputs = form.querySelectorAll("input[required]");
    const btn = form.querySelector(".btn-consultar");

    // marca inputs especiais
    const cpfCnpj = document.getElementById("cpfCnpj");
    const celular = document.getElementById("celular");
    if (cpfCnpj) cpfCnpj.dataset.kind = "cpfCnpj";
    if (celular) celular.dataset.kind = "celular";

    // máscaras
    cpfCnpj?.addEventListener("input", (e) => {
      e.target.value = mascaraCpfCnpj(e.target.value);
      validarCampo(e.target);
      habilitarBotaoSeValido(form, btn);
    });

    celular?.addEventListener("input", (e) => {
      e.target.value = mascaraCelular(e.target.value);
      validarCampo(e.target);
      habilitarBotaoSeValido(form, btn);
    });

    inputs.forEach(input => {
      input.addEventListener("input", () => {
        validarCampo(input);
        habilitarBotaoSeValido(form, btn);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valido = true;
      inputs.forEach(i => { if (!validarCampo(i)) valido = false; });
      if (!valido) return;

      const data = {
        nome: form.nome.value,
        cpfCnpj: form.cpfCnpj.value,
        email: form.email.value,
        celular: form.celular.value,
        processo: form.processo.value
      };

      try {
        /* IMPORTANTE:
           - Para somente "enviar" (sem ler resposta), no-cors funciona.
           - Aqui mantive do jeito que você tinha para não quebrar.
        */
        await fetch("https://script.google.com/macros/s/AKfycbz42M6bgQepkbRjG9kxG85n7buZoJq0vc0iAbHy2xq3zym5ueu9c-YMSZ_PmdMF9zaZ/exec", {
          method: "POST",
          mode: "no-cors",
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
    });
  }

  /* ===== PARCERIA (novo formulário, com retorno de código) ===== */
  const formParc = document.getElementById("formParceria");
  if (formParc){
    const inputs = formParc.querySelectorAll("input[required]");
    const btnParc = document.getElementById("btnParceria");

    const parcTelefone = document.getElementById("parcTelefone");
    if (parcTelefone) parcTelefone.dataset.kind = "celular";

    const box = document.getElementById("codigoParceriaBox");
    const valor = document.getElementById("codigoParceriaValor");

    // máscara telefone
    parcTelefone?.addEventListener("input", (e) => {
      e.target.value = mascaraCelular(e.target.value);
      validarCampo(e.target);
      habilitarBotaoSeValido(formParc, btnParc);
    });

    // validação em tempo real
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        validarCampo(input);
        habilitarBotaoSeValido(formParc, btnParc);
      });
    });

    formParc.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (box) box.style.display = "none";
      if (valor) valor.textContent = "—";

      let valido = true;
      inputs.forEach(i => { if (!validarCampo(i)) valido = false; });
      if (!valido) return;

      const payload = {
        nome: formParc.nome.value.trim(),
        email: formParc.email.value.trim(),
        telefone: formParc.telefone.value.replace(/\D/g, "")
      };

      try {
        const resp = await fetch("https://script.google.com/macros/s/AKfycbwut6wLYZTvF1q2Dhn0en7T1t6xQK_HSVvQv6lxn5fd_8739hiTVvFpwDX7vG7pM1S3/exec", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" }, // <- evita preflight
          body: JSON.stringify(payload)
        });

        const raw = await resp.text();

        let code = "";
        try {
          const json = JSON.parse(raw);
          code = (json.code || json.codigo || "").toString().trim();
        } catch {
          code = raw.trim();
        }

        if (!code) {
          console.error("Resposta bruta da API:", raw);
          throw new Error("API não retornou o código.");
        }

        if (valor) valor.textContent = code.toUpperCase();
        if (box) box.style.display = "block";

        habilitarBotaoSeValido(formParc, btnParc);

      } catch (err) {
        alert("Erro ao cadastrar parceria. Verifique a implantação da Web App (acesso público), CORS e tente novamente.");
        console.error(err);
      }
    });
  }
});