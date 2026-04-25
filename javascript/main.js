const CONTACTS = {
  whatsapp: "5512997018997",
  email: "bonsventosassistencia@gmail.com"
};

const form = document.querySelector("#repairForm");
const preview = document.querySelector("#messagePreview");
const sendWhatsapp = document.querySelector("#sendWhatsapp");
const sendEmail = document.querySelector("#sendEmail");
const clearForm = document.querySelector("#clearForm");
const year = document.querySelector("#currentYear");
const whatsappLinks = Array.from(document.querySelectorAll("[data-whatsapp-link]"));

const sanitizePhone = (value) => {
  return String(value || "").replace(/\D/g, "");
};

const buildWhatsappLink = (message = "") => {
  const phone = sanitizePhone(CONTACTS.whatsapp);
  if (!phone) {
    return "#";
  }

  const normalizedMessage = String(message || "").trim();
  if (normalizedMessage.length === 0) {
    return `https://wa.me/${phone}`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(normalizedMessage)}`;
};

const syncStaticWhatsappLinks = () => {
  whatsappLinks.forEach((link) => {
    const customMessage = String(link.dataset.whatsappText || "").trim();
    link.href = buildWhatsappLink(customMessage);
  });
};

const buildMessage = (fields) => {
  return [
    "Ola, Bons Ventos. Quero solicitar um conserto:",
    "",
    `Nome: ${fields.nome}`,
    `WhatsApp: ${fields.telefone}`,
    `Tipo de aparelho: ${fields.aparelho}`,
    `Marca e modelo: ${fields.modelo}`,
    `Problema: ${fields.problema}`,
    `Periodo para retorno: ${fields.periodo}`
  ].join("\n");
};

const setChannels = (message) => {
  const encoded = encodeURIComponent(message);
  const subject = encodeURIComponent("Pedido de Conserto - Bons Ventos");
  const to = encodeURIComponent(CONTACTS.email);
  sendWhatsapp.href = buildWhatsappLink(message);
  sendEmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${encoded}`;
  sendWhatsapp.classList.remove("is-disabled");
  sendEmail.classList.remove("is-disabled");
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const fields = {
    nome: String(data.get("nome") || "").trim(),
    telefone: String(data.get("telefone") || "").trim(),
    aparelho: String(data.get("aparelho") || "").trim(),
    modelo: String(data.get("modelo") || "").trim(),
    problema: String(data.get("problema") || "").trim(),
    periodo: String(data.get("periodo") || "").trim()
  };

  const missing = Object.values(fields).some((value) => value.length === 0);
  if (missing) {
    preview.textContent = "Preencha todos os campos obrigatorios para gerar o pedido.";
    sendWhatsapp.classList.add("is-disabled");
    sendEmail.classList.add("is-disabled");
    return;
  }

  const message = buildMessage(fields);
  preview.textContent = message;
  setChannels(message);
});

clearForm.addEventListener("click", () => {
  form.reset();
  preview.textContent = "Preencha o formulario para gerar sua mensagem.";
  sendWhatsapp.classList.add("is-disabled");
  sendEmail.classList.add("is-disabled");
  sendWhatsapp.href = "#";
  sendEmail.href = "#";
});

syncStaticWhatsappLinks();
sendWhatsapp.href = "#";
year.textContent = String(new Date().getFullYear());
